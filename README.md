# monoski

Because it slides.

## About

`monoski` is a minimalistic framework to publish HTML slides that is intended to be easy to use and easy to tailor to your needs. It consists of less than 100 lines of commented javascript and less than 100 lines of CSS (excluding theming). 

It supports:

- Fragments in slides in a similar fashion as RevealJS but with improvements (see [Fragments section](#fragments) below)
- PDF export by printing to file,
- Easily generates javascript-free slides: navigation could be done by scrolling (using CSS scroll-snap properties). This is not implemented (yet?) but exporting the generated DOM and removing javascript file should work!
- Unique URL for each (fragment of a) slide. 

## Why

As an academic, I spend a huge amount of time creating presentations for seminars and conferences. And as a computer scientist, I hate being outside a text editor for too long. Hence the need for a text based solution for creating slides. 

After having happily used [beamer](https://github.com/josephwright/beamer) for a time, I found myself limited compared to what I was able to quickly build in a browser in a few minutes. Knowing CSS, it was frustrating to use a langage for writing slides where the style was not that easy to separate from the code itself. And knowing javascript, it was annoying to write scripts to generate 10 svg files just to animate an algorithm I could have directly implemented and illustrated in a browser anyway. 

This is when I started writing all my presentation in HTML/CSS, using (the incredible!) [pandoc](https://pandoc.org/) to compile from markdown to (the also incredible!) [reveal.js](https://revealjs.com/) framework. Writing markdown instead of LateX felt like a breath, and styling with CSS allowed me to be more precise than ever, animating an algorithm with javascript felt so simple and combining the [fragments abstraction](https://revealjs.com/) from reveal.js with CSS was really liberating! 

But at some point, I got frustrated with reveal.js too. This text is not intended as a critic of reveal.js since it is, as I said, an incredible tool, but let me list a few caveats I encountered while using reveal.js. First, it was hard to tinker with the CSS sometimes, because the tool being so polished, its base CSS was intefering too much with my mental model of the webpage, preventing me to achieve exactly what I needed. At some point, I managed to ditch most of what I did not need and managed to design a style I liked and which I had control on. 

I hit a more annoying limitation later though. On a slide, I wanted a fragment block to appear on the second transition and on the fourth one only, which seems like a pretty common scenario when writing slides. Beamer allows it via the `\onslide` function, but reveal.js does not, and it is apparently [not on the todo list](https://github.com/hakimel/reveal.js/issues/889). While I am perfectly fine with hakimel not wanting to implement this functionality, I started getting annoyed by this and had other cool ideas to improve the fragment feature. Implementing them directly in reveal.js may have worked but it looked like a ton of work not to break anything else with the design I had in mind. An another common annoyance: it is not straightforward to display a [fragment right on the beginning of a slide](https://github.com/hakimel/reveal.js/issues/2560), which is also something I often found myself to need. Finally, the PDF export was sometimes buggy and it was hard to identify why without getting deep into reveal.js codebase.

Most of my critics have workaround, but then you need to interfere with parts of reveal.js I would prefer to stay away from. Moreover, I realised at some point that I was using only a fraction of reveal.js. I had ditched most of the theming to fit my tastes and a large portion of the heavy lifting (like compiling from markdown or displaying latex math mode) was done by pandoc anyway. I hence started playing with the idea of developing a very minimalistic framework fitting only my needs. *How hard could it be?* I wanted it to be as simple as possible and yet implement PDF export and the fragment mecanism. 

One day I was actively procrastinating on HackerNews, someone linked to [Dave Gauer's minislides framework](http://ratfactor.com/minslides/). As a geek on the lower side of the tech, I immediately loved it! Resizing each slide to be of the size of the viewport and then using `scrollIntoView()` function to navigate the slides is just neat! And with only a few lines of CSS, one can get the PDF export for free: just add a page break after every slide! I was playing with the idea of using it as my daily driver for making presentations but I really need fragments to animate slides. That shouldn't be so hard to add fragment mecanism to it, should it? Turns out, it's not. Plus I poured some improvements in the mix from the reveal.js approach: fragment can have more than one index, they can be easily displayed at the start by just adding class `.current-fragment` and the indices can be strings, appearing in alphabetical order (why, you ask? Have you sometimes inserted a new fragment between indices 1 and 2? Do you remember translating everything coming after? Now you can make the fragment appears at index "1a"!).

Hence, `monoski`. Took me more time to find the name and write this README than to write the code. I sprinkle a few other functionalities I needed: implement a URL mecanism to point toward one slide in particular, add slide numbers and make a mecanism that is compatible between navigating the presentation using javascript or by scrolling! I am happy with the result, and I want to share it here! Hope you will enjoy it and use it to hack it to your need and make nice slides!

## Getting started

Here is a minimal example of a presentation:

``` html
<doctype html>
<html>
<head><link rel="stylesheet" href="monoski.css"></head>
<body>
  <script src="monoski.js" charset="utf-8" type="text/javascript"></script>
<div class="slide">
<h1>Monoski</h1>
</div>

<div class="slide">
<h2>Sliding</h2>
</div>

</body>
</html>
```

## How to use

### From HTML 

Include `monoski.js` and `monoski.css` in your HTML file and start writing your slides. Each slide is a block with the CSS class `slide`. If you need to animate a slide (in the sense that some part will appear after a few transition), you need to use the fragment mecanism. It is really similar to the [one of reveal.js](https://revealjs.com/fragments/) but I added a few things I usually need. 

An example is better than words (see [Fragments section](#fragments)) for a technical explanation of how it works (or read the code).

``` html
<div class="slide">
<h2>Fragment illustration</h2>

<p class="fragment fade current-fragment">I will show you a list</p>

<ul>
<li>Here from the start</li>
<li class="fragment">Appears on the first fragment; fragment index is 1 implicitly</li>
<li class="fragment" data-fragment-index="1">Appears on the first fragment too</li>
<li class="fragment">Appears on the second fragment; fragment index is 2 implicitly</li>
<li class="fragment fade" data-fragment-index="1 foo">Appears on the first and last fragment</li>
</ul>
</div>
```

If a block has class `fragment`, then it will be hidden until its fragment index is visited. It then stays on the slide except if it has the `fade` class. A block may have several indices separated by spaces and specified in the `data-fragment-index` attribute. Indices may be any string without whitespaces. If no fragment index is given, it will get a number as index, corresponding to its rank in the DOM. The first paragraph will appear right away because it has the `current-fragment` class then disappear because it has the `fade` class. See `fragment.css` to get an idea on how it works!

### From pandoc

As I said, I am pretty low tech but too lazy to write HTML directly. You can easily generate your presentation from markdown using [pandoc](https://pandoc.org/). Indeed, most html-based slides frameworks are based on the same idea of having each slide in a block with class `slide` so we can directly use the `s5` export of pandoc for example with a small template. See the demo folder for an example ! Pandoc has a lovely syntax for span and fenced divs that I really enjoy while typing lecture notes or presentations. 

### Fragments{#fragments}

## Hacking it

The point of `monoski` is to hack it to fit your needs. I tried to keep the code readable and small so that it is easy, but let me walk you through the different part you may need to edit. 

### Theming

Maybe you have bad taste and dislike orange, or maybe some manager wants you to make everything golden with a startupy logo on top. In that case, I guess you want to edit `theme.css`. I made this file as modular as possible, and pretty short, so I guess you will find your way in changing the colors and styles! 

### Fragments

I "implemented" a few fragments mecanism from reveal.js but some are missing, or maybe you want to make your own. Be my guest, and start fiddling in `fragment.css`. To understand, you need to have the right mental model of what happens to block with class `fragment` inside a slide. A slide containing such blocks is cloned into several slides, where each block with class `fragment` is modified as follows: 

- a block with class `fragment` will at some point have the `current-fragment` class; this will happen for any index listed in the `data-fragment-index` attribute (separated by spaces); if `data-fragment-index` is undefined then the block will have one index, which is a number corresponding to its rank among every block with class fragment
- a block that has receive the `current-fragment` class once will also keep the `fragment-visited` class for the rest of the slide. 

Fragment indexes are sorted using alphabetical order. Using this, it is pretty easy to implement in CSS a mecanism that makes a block appears when it is visited for the first time and then stay on the slides as follows:

``` css
.fragment {
    visibility: hidden;
}
.fragment.fragment-visited {
    visibility: visible;
}
.fragment.current-fragment {
    visibility: visible;
}

```

Indeed, the fragment is hidden by default and becomes visible as soon as it has the `current-fragment` class. It then remains visible because it has the `fragment-visited` class after this point! Now, if you want to make the fragment disappear when it is not in `current-fragment` class, then we can use a `fade` class and add the code:

``` css
.fragment.fade:not(.current-fragment) {
    visibility: hidden;
}
```

And voilà! We can easily adapt this to blur, highlight or whatever depending on what you want to do! See `fragment.css` then.

There is a small caveat to it: if you want a block to replace another. The trick is to put them as children of a block where the will have the same position and then display them one after the other. You can find the definition of class `rstack` in `fragment.css` that does just that: it is a 1 by 1 CSS grid such that every direct child is on column and row 1! Hence the code:

``` html
<div class="rstack">
<p class="fragment fade">Hello</p>
<p class="fragment fade">world</p>
</div>
```

will replace Hello by world after the first transition. 

If you cannot express what you need in pure CSS, then maybe you need to modify the `generate_fragment()` function in `monoski.js` that is the one that generates every version of a given slide! It is a very short and hopefuly readable function, so do not hesistate to modify it!

### PDF export and printing

PDF export is done via printing to a file. Since each slide and its fragments appear in successive blocks, one can "simply" print each such block on a new page using CSS defined page break. This is defined in `print.css`. I am using predefined 16:9 paper size that I think looks good but you can easily change that. 

An idea illustrating what is possible: change body to be a 3x2 grid and make slides smaller to get a printable handout of the presentation!

### General layout

If you want to get your hands dirty and really change how slide layout is done, you should edit `layout.css` and maybe change the DOMContentLoaded event function in `monoski.js`. You may very well break things here, but I hope the code is short and readable enough so that you will be able to adapt it to your needs!
