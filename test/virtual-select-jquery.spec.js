import 'src/virtual-select-jquery';
import { CursorUp, CursorDown, Enter, Escape } from 'src/common/keys';

describe(`virtualselect`, () => {
  let element;
  let options;

  function container() {
    return element.find('.ui-virtual-select');
  }

  function searchInput() {
    return element.find('.ui-virtual-select--search-input');
  }

  function items() {
    return element.find('.ui-virtual-select--items');
  }

  function loadingIndicator() {
    return element.find('.ui-virtual-select--loading-indicator');
  }

  function triggerKeydownEventOn(target, which) {
    const event = new jQuery.Event('keydown');
    event.which = which;
    target.trigger(event);
  }

  beforeEach(() => {
    const availableItems = [];
    for (let i = 0; i < 40; i++) {
      availableItems.push(i);
    }
    element = $(`<div class="test-container"></div>`);
    options = {
      onSelect: sinon.stub(),
      itemHeight: 30,
      dataProvider: {
        availableItems,
        load() {
          this.items = this.availableItems;
          return Promise.resolve();
        },
        get(start, end) {
          return this.items.slice(start, end);
        },
        identity(item) {
          return item;
        },
        displayText(item) {
          return `Item ${item}`;
        },
        filter(query) {
          this.items = this.availableItems.filter((item) => item == query); // eslint-disable-line eqeqeq
        },
        noSelectionText() {
          return 'Please choose';
        },
      },
    };
    element.virtualselect(options);
    element.virtualselect('select', 15);
    element.appendTo(document.body);
  });
  afterEach(() => {
    element.remove();
  });
  describe(`initially`, () => {
    it(`should display the selected items display text as placeholder`, () => {
      expect(searchInput()).to.have.attr('placeholder', options.dataProvider.displayText(15));
    });
  });
  describe(`on search input focus`, () => {
    it(`should display the loading indicator until data is loaded`, (done) => {
      searchInput().focus();
      expect(loadingIndicator()).to.be.visible;
      expect(items()).not.to.be.visible;
      setTimeout(() => {
        expect(loadingIndicator()).not.to.be.visible;
        expect(items()).to.be.visible;
        done();
      }, 0);
    });
    it(`should show item list`, (done) => {
      searchInput().focus();
      setTimeout(() => {
        expect(items()).to.be.visible;
        done();
      }, 0);
    });
    it(`should scroll item list to position of selected element`, (done) => {
      searchInput().focus();
      setTimeout(() => {
        expect(items().scrollTop()).to.equal(15 * 30);
        done();
      }, 0);
    });
  });
  describe(`on search input blur`, () => {
    beforeEach((done) => {
      searchInput().focus();
      setTimeout(done, 0);
    });
    it(`should hide the item list`, () => {
      searchInput().blur();
      expect(items()).to.be.hidden;
    });
    it(`should clear the search input`, () => {
      searchInput().val('10');
      expect(searchInput()).to.have.value('10');
      searchInput().blur();
      expect(searchInput()).to.have.value('');
    });
    it(`should display the selected items display text as placeholder`, () => {
      expect(searchInput()).attr('placeholder', 'Item 15');
    });
  });
  describe('given search input has focus', () => {
    beforeEach((done) => {
      searchInput().focus();
      setTimeout(done, 0);
    });
    describe(`when scrolling to top of item list`, () => {
      it(`should render the first 30 options`, (done) => {
        items().scrollTop(0);
        // scrolling is throttled, so we have to wait for a short period of time
        setTimeout(() => {
          for (let i = 0; i < 30; i++) {
            expect(element.find(`.ui-virtual-select--item:eq(${i})`)).to.have.text(`Item ${i}`);
          }
          expect(element.find('.ui-virtual-select--item').get(30)).to.be.undefined;
          done();
        }, 20);
      });
    });
    describe(`when scrolling to bottom of item list`, () => {
      it(`should render the last 20 options`, (done) => {
        items().scrollTop(10000000);
        // scrolling is throttled, so we have to wait for a short period of time
        setTimeout(() => {
          for (let i = 0; i < 20; i++) {
            expect(element.find(`.ui-virtual-select--item:eq(${i})`)).to.have.text(`Item ${i + 20}`);
          }
          expect(element.find('.ui-virtual-select--item').get(20)).to.be.undefined;
          done();
        }, 20);
      });
      it(`should not have a scroll position larger than "number of options" * "option height"`, (done) => {
        items().scrollTop(10000000);
        // scrolling is throttled, so we have to wait for a short period of time
        setTimeout(() => {
          expect(element.find(`.ui-virtual-select--items`).scrollTop()).to.equal(900);
          done();
        }, 20);
      });
    });
    describe(`when stepping to bottom of item list (via keyboard)`, () => {
      it(`should activate the next item`, () => {
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 15');
        triggerKeydownEventOn(searchInput(), CursorDown);
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 16');
      });
      it(`should not step over the last item`, () => {
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 15');
        for (let i = 0; i < 100; i++) {
          triggerKeydownEventOn(searchInput(), CursorDown);
        }
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 39');
      });
    });
    describe(`when stepping to top of item list (via keyboard)`, () => {
      it(`should activate the previous item`, () => {
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 15');
        triggerKeydownEventOn(searchInput(), CursorUp);
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 14');
      });
      it(`should not step over the first item`, () => {
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 15');
        for (let i = 0; i < 100; i++) {
          triggerKeydownEventOn(searchInput(), CursorUp);
        }
        expect(element.find(`.ui-virtual-select--item.active`)).to.have.text('Item 0');
      });
    });
    describe(`on item select (via click)`, () => {
      it(`should make the selection the new selected item`, () => {
        // TODO Currently there is no way to "get" the selected item. Maybe that would be nice...
        element.find('.ui-virtual-select--item:eq(11)').click();
        expect(searchInput()).to.have.attr('placeholder', 'Item 16');
      });
      it(`should notify the outside world via onSelect callback about the selection`, () => {
        element.find('.ui-virtual-select--item:eq(11)').click();
        expect(options.onSelect).to.have.been.calledWith(16);
      });
      it(`should hide the item list`, () => {
        expect(element.find('.ui-virtual-select--items')).to.be.visible;
        element.find('.ui-virtual-select--item:eq(11)').click();
        expect(element.find('.ui-virtual-select--items')).to.be.hidden;
      });
      it(`should clear the search input`, () => {
        searchInput().val('2');
        expect(searchInput()).to.have.value('2');
        element.find('.ui-virtual-select--item:eq(0)').click();
        expect(searchInput()).to.have.value('');
      });
      it(`should display the newly selected items display text as placeholder`, () => {
        element.find('.ui-virtual-select--item:eq(11)').click();
        expect(searchInput()).to.have.attr('placeholder', 'Item 16');
      });
    });
    describe(`on item select (via keyboard)`, () => {
      it(`should make the selection the new selected item`, () => {
        triggerKeydownEventOn(searchInput(), CursorDown);
        triggerKeydownEventOn(searchInput(), Enter);
        expect(searchInput()).to.have.attr('placeholder', 'Item 16');
      });
      it(`should notify the outside world via onSelect callback about the selection`, () => {
        triggerKeydownEventOn(searchInput(), CursorDown);
        triggerKeydownEventOn(searchInput(), Enter);
        expect(options.onSelect).to.have.been.calledWith(16);
      });
      it(`should hide the item list`, () => {
        expect(element.find('.ui-virtual-select--items')).to.be.visible;
        triggerKeydownEventOn(searchInput(), Enter);
        expect(element.find('.ui-virtual-select--items')).to.be.hidden;
      });
      it(`should clear the search input`, () => {
        searchInput().val('2');
        expect(searchInput()).to.have.value('2');
        triggerKeydownEventOn(searchInput(), Enter);
        expect(searchInput()).to.have.value('');
      });
      it(`should display the newly selected items display text as placeholder`, () => {
        triggerKeydownEventOn(searchInput(), CursorDown);
        triggerKeydownEventOn(searchInput(), Enter);
        expect(searchInput()).to.have.attr('placeholder', 'Item 16');
      });
    });
    it(`moving the mouse cursor over an item activates it`, (done) => {
      expect(element.find('.ui-virtual-select--item.active')).to.have.text('Item 15');
      element.find('.ui-virtual-select--item.active + .ui-virtual-select--item').trigger('mousemove');
      setTimeout(() => {
        expect(element.find('.ui-virtual-select--item.active')).to.have.text('Item 16');
        done();
      }, 150);
    });
    it(`pressing escape while search input has focus causes blur`, () => {
      expect(element.find('.ui-virtual-select--items')).to.be.visible;
      triggerKeydownEventOn(searchInput(), Escape);
      expect(element.find('.ui-virtual-select--items')).to.be.hidden;
    });
    it(`entering text into the search input filters the options`, (done) => {
      const event = new jQuery.Event('keyup');
      searchInput().val('1').trigger(event);
      setTimeout(() => {
        expect(element.find('.ui-virtual-select--item')).to.have.length(1);
        done();
      }, 20);
    });
    it(`clicking outside the select component should cancel the selection`, () => {
      searchInput().val('2');
      expect(searchInput()).to.have.value('2');
      $(document.body).click();
      searchInput().blur();
      expect(searchInput()).to.have.value('');
      expect(element.find('.ui-virtual-select--items')).to.be.hidden;
    });
  });
  it(`can be focussed via external trigger`, (done) => {
    expect(container()).not.to.have.class('open');
    element.virtualselect('focus');
    setTimeout(() => {
      expect(container()).to.have.class('open');
      done();
    }, 0);
  });
  it(`can be caused to pre-load the data via external trigger`, () => {
    sinon.spy(options.dataProvider, 'load');
    element.virtualselect('load');
    expect(options.dataProvider.load).to.have.been.called;
  });
});
