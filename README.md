# virtual-select
This (jQuery) component aims to work well in rare scenarios in which `select2` or `selectize` just don't cut it. Not because they are bad (which they are definitely not!), but because of horrible, horrible constraints of your own project environment.

Like being forced to pre-load hundreds of thousands of options in one go, because the backend request is incredibly slow, but there is nothing you can do about it, because it's not your own. Or if your corporate design is very particular about certain aspects of the select component.

`virtual-select` is designed to minimize DOM manipulations and memory consumption, in order to deal with large amounts of data. It takes inspiration from many different sources, including but not limited to:
- **Data-driven programming:** The entire state is maintained in a simple object and altered by passing it to functions that return a modified version of this object.
- **ReactJS:** The above mentioned state object is passed down to some self-contained UI components, which are responsible of making the DOM reflect that state in as few steps as possible.
- **Virtual scrolling**: Instead of creating DOM elements for all options at once, only the ones that are actually visible will be created. As you scroll, those elements will be simply reused. The scrollbar, however, looks and feels just as if all options were rendered. I took my initial inspiration from [this great article](http://twofuckingdevelopers.com/2014/11/angularjs-virtual-list-directive-tutorial/).

The initial proof-of-concept of `virtual select` was an entangled mess, as state changes and DOM manipulations were often handled by the same function. It quickly became apparent, that a stricter separation of rendering and state would make the code-base much easier to comprehend and maintain. (Who would've thought, right? Duh.)

I also had some specific goals in mind:
- **Virtual Scrolling**: Because of the huge amount of options I need to display, rendering all at once was just not possible.
- **Themeable**: Don't you hate it when the styling of a third-party UI component and your page interfere with each other? I know I do. That's why I wanted to make this component so easy to style, you probably don't even want to include the default styles.
- **Typeahead**: To comprehend the potentially long list of options, this is a must-have.
- **Keyboard Navigation**: For that native feel and extra convenience.
- **Extended display mode**: As a pro feature I'd like to offer an alternate or extended view of the options, so my power-users can save some time (e.g. displaying a user id next to its name).
- **Customizable Option Text**: Just provide a function that converts the given item into a string representation.
- **Customizable Search**: Because one size doesn't fit all.
- **Customizable Load Logic**: Whether the data is static or fetched via remote call, it should be in your hands from where and when the data is loaded.
- **Customizable Loading Indicator**: Because I have to deal with a painfully slow backend and users will see this one a lot.
- **Automated testing against all target browsers**: My application must work with IE8+ and the last 2 versions of modern browsers. Spinning up virtual machines to test changes is time consuming and annoying. So I want to automate it by using [SauceLabs](https://saucelabs.com).
- **Angular Integration**: Although `virtual-select` is now just a jQuery component (and could probably be stripped down to a pure DOM component), it has to play nice with Angular and other frameworks. Especially when it comes to keeping the Angular Model and the component state in sync.

Now you might say: "But `select2` or `selectize` can do all the stuff you need!". And you are probably right. The thing is, I've been using both of them for a couple of years now in the same project environment I created `virtual-select` for, and they never felt quite right for my scenario. Maybe the Angular wrappers got in the way. Maybe the fact that I always needed to dumb those nice looking components down to fit the "not so modern" design of the project I need it for. I don't really know. All I know is that I spent a lot of time trying to make those components behave just the way I needed them to and just couldn't make it work. After a couple of unsuccessful days, I decided that I might as well make it a fun learning project and write a custom tailored component myself.

It was (and still is) a nice learning experience to write and publish an open-source JavaScript library with bleeding-edge technologies like JSPM and ES2015. So please take this project for what it is: it is a custom solution for a very particular set of problems I've been fighting with for a very long time. But more than that: it's not meant to be the next `select2` or `selectize`. If you are looking for a highly flexible select component, please look at those two libraries first. They will most likely make you very happy. If not, maybe we meet again. :)
