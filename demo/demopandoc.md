---
title: monoski
subtitle: Hackable minimal
author: Florent Capelli
institute: Université d'Artois, CRIL
date: 01/05/2025
---

# Generality on monoski

## Functionnality

- [Easy slide]{.fragment .highlight}
- Fragments as RevealJS but better
- Native print to pdf
- [Generates exportable HTML to work without monoski]{.fragment .highlight}

## Easy to hack

Less than 100loc of js! 

Navigation from [Dave Gauer](https://ratfactor.com/minslides/)

``` javascript
    document.addEventListener('keypress', function(event){
        if(event.key == 'j'){ current++; }
        if(event.key == 'k'){ current--; }
        if(current < 0){ current = 0; }
        if(current >= slides.length){ current = slides.length - 1; }
        slides[current].scrollIntoView();
	window.location.hash = `/${current}`;
    });
```

# Fragment mecanism

## similar to RevealJS

Fragments mecanism more involved than RevealJS:

[This paragraph has class `fragment` and appears at the next transition.]{.fragment}

[This paragraph also has class `fragment` but has `data-fragment-index="3"`.]{.fragment data-fragment-index="3"}

[This paragraph has class `fragment` and appears at the second transition.]{.fragment}


## String indices of fragments

Support string for fragment indices:


:::{.fragment data-fragment-index="1c"}
```html
<p class="fragment" data-fragment-index="1c">Appears third</p>
```
:::

:::{.fragment data-fragment-index="1b"}
```html
<p class="fragment" data-fragment-index="1b">Appears second</p>
```
:::

:::{.fragment}
```html
<p class="fragment">Appears first (index is implicitly 1)</p>
```
:::

:::{.fragment}
```html
<p class="fragment">Appears last (index is implicitly "2" > "1c")</p>
```
:::



## Multiple fragments

:::{.fragment .fade data-fragment-index="1 3"}
```html
<p data-fragment-index="1 3" class="fragment fade">
On fragment 1 and 3. 
Fade class hides the fragment outside its indices.
</p>
```
:::

:::{.fragment data-fragment-index="1"}
```html
<p data-fragment-index="1" class="fragment">On every fragment after 1!</p>
```
:::

:::{.fragment data-fragment-index="2"}
```html
<p data-fragment-index="2" class="fragment">On every fragment after 2!</p>
```
:::


## Fragment in css

Fragments are mostly dealt with in css:
``` css
.fragment {
    visibility: hidden;
}
.fragment.fragment-visited {
    visibility: visible;
}
.fragment.fade {
    visibility: hidden;
}
.fragment.current-fragment {
    visibility: visible;
}
```

## Stacking in fragment

Just force everything on the same place using `rstack` class:

:::{.rstack .center}

[*JUST*]{.fragment .fade .current-fragment data-fragment-index="4"}

[DO]{.fragment .fade}

[**IT**]{.fragment .fade}

:::

# Exporting

## Preprocessing

- Upon loading, every fragment of a slide is computed and added to the DOM
- One "slide" block per transition

## Advantages

- Export the HTML: no need for javascript anymore (but for navigation)
- Print to file: PDF export!

``` css

@media print {
    @page {
	size:  20.75in 10.36in;
	margin: 0;
    }
}
```

# Pandoc

## From markdown to monoski

- Follow the usual slide structure: one div with class `slide` for a slide
- For example `pandoc -s -t revealjs file.md -o file.html` generates the right structure!
- Only use custom template to add `monoski.js` and `monoski.css`!
- *Future work (maybe?)*: a dedicated pandoc templating method

## Example

``` markdown
---
title: Example
author: F
---

# Section 1

## Slide 1

Hi

## Slide 2

This is it!
```

## Full pandoc power

- Easy math $x+y=25$
- Pandoc filtering!

