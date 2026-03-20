/*
  Monosurf is a version of monoski that is pure js.
  Slides are not materialized and nodes are not copied.
  It makes export harder but allows more flexibility.
  */
/*
  Orders fragments of DOM-node s
*/
function generate_fragments(s) {
    // Compute index for fragment without index: rank of the fragment in DOM order (for nodes wo specified index)
    // Nodes with current-fragment are displayed from the beginning.
    s.querySelectorAll(".fragment:not(.fragment[data-fragment-index], .current-fragment)").forEach( function(e,i,t) {
	e.setAttribute("data-fragment-index",i+1)
    });
    
    // Map each fragment index to its set of nodes
    var frObj = {};

    s.querySelectorAll(".fragment[data-fragment-index]").forEach( f =>
	f.getAttribute("data-fragment-index").split(" ").forEach(k => Object.hasOwn(frObj,k) ? frObj[k].push(f) : frObj[k] = [f])
    );
    
    // Sorting fragment Keys 
    var frKeys = Object.keys(frObj).sort( function (a,b) {
	na = isNaN(parseInt(a)) ? -1 : parseInt(a); // parseInt parses the longest int prefix.
	nb = isNaN(parseInt(b)) ? -1 : parseInt(b);
	if (na == nb) { return a > b ? 1 : -1 }
	else { return na-nb}
    }
					);
    
    frObj["0"] = s.querySelectorAll(".current-fragment"); // initial fragment.
    frKeys = ["0"].concat(frKeys);
    
    d = {};
    d.node = s;
    d.frOrder = frKeys;
    d.frNodes = frObj;
    return d;
}

/* Render slide from precomputed array; new/previous state  */
function renderSlide(slidesArray, nstate, pstate) {

    d = slidesArray[nstate.sidx];
    currentSlide =d.node;
    fidx = nstate.fidx; 
    
    // Show the new slide
    if (nstate.sidx != pstate.sidx) {
	if (pstate.sidx>=0) // initialized with -1, avoid out of bounds.
	    slidesArray[pstate.sidx].node.style.display = 'none';
	
	currentSlide.style.display = 'flex';
    }
    
    document.querySelector(".slide-number").innerHTML = `${nstate.sidx+1}.${nstate.fidx+1}/${slidesArray.length}`;

    console.log(nstate);
    currentFragment = d.frNodes[d.frOrder[fidx]];
    nfrag = d.frOrder.length;
    
    currentSlide.querySelectorAll(".current-fragment").forEach(
	function (e) { e.classList.remove("current-fragment"); }
    ); // reset classes in slide by removing current-fragment
    currentSlide.querySelectorAll(".fragment-visited").forEach(
	function (e) { e.classList.remove("fragment-visited"); }
    ); // reset classes in slide by removing fragment-visited classes

    currentFragment.forEach(e => e.classList.add("current-fragment"));


    // add visited fragment to the others
    for(i=0; i<fidx;i++) {
	d.frNodes[d.frOrder[i]].forEach(function (e) {
	    if (!e.classList.contains("fragment-visited")) { // new fragment-visited are taged as such
		e.classList.add("fragment-visited");
	    }
	}				       );
    }
    // cancel onvisit from later fragments
    for(i=fidx+1; i<nfrag; i++) {
	d.frNodes[d.frOrder[i]].forEach(function (e) {
	    if(e.hasAttribute("data-rev")) {
		eval(e.getAttribute("data-rev"));
		
	    }
	});
    }

	
    currentSlide.querySelectorAll(".current-fragment[data-onvisit]").forEach(
	function (e) { eval(e.getAttribute("data-onvisit")) }
    );
    
    
    window.location.hash = `/${nstate.sidx}.${nstate.fidx}`;

    /* todo: execute onvisit, add slide number */
}

document.addEventListener("DOMContentLoaded", function (e) {
    // data src for reveal compatibility
    document.querySelectorAll("img[data-src]").forEach( function (e) {
	e.setAttribute("src",e.getAttribute("data-src"));
	e.setAttribute("loading","lazy");
    });

    document.querySelectorAll("iframe[data-src]").forEach( function (e) {
	e.setAttribute("src",e.getAttribute("data-src"));
	e.setAttribute("loading","lazy");
    });

    // Slide number box
    var divSlideNumber = document.createElement("div");
    divSlideNumber.classList.add("slide-number");
    document.body.appendChild(divSlideNumber);    


    // Generate fragments of every slide
    document.querySelectorAll(".slide").forEach(function (e) { e.style.display = 'none'} );
    slides = Array.from(document.querySelectorAll(".slide")).map(e=>generate_fragments(e));

    // making states
    function mkState(sidx, fidx) {
	d = {};
	d.sidx = sidx;
	d.fidx = fidx;
	return d;
    }

    function nextState(slides, state) {
	nfrag = slides[state.sidx].frOrder.length;
	if (state.fidx >= nfrag-1) {
	    if (state.sidx+1 < slides.length)
		return mkState(state.sidx+1, 0);
	    else
		return state; // last slide, last fragment
	} else {
	    return mkState(state.sidx, state.fidx+1); // next fragment
	}	
    }
    function prevState(slides, state) {
	if (state.fidx>0) {
	    return mkState(state.sidx, state.fidx - 1);
	} else {
	    if (state.sidx == 0)
		return state;
	    else 
		return mkState(state.sidx-1, slides[state.sidx-1].frOrder.length-1);	    
	}	
    }

    function nextSlide(slides, state) {
	nstate = nextState(slides, state);
	renderSlide(slides, nstate, state);
	return nstate;
    }

    function prevSlide(slides, state) {
	nstate = prevState(slides, state);
	renderSlide(slides, nstate, state);
	return nstate;
    }

    /* URL mecanism for sharing */
    var hashW = window.location.hash.substring(1);
    var state = mkState(0,0);
    
    if (hashW != "") {
	if (hashW[0] == "/") {
	    l = hashW.substring(1).split(".");
	    if (l.length == 2) {
		var sidx = parseInt(l[0]);
		var fidx = parseInt(l[1]);
		state.sidx = isNaN(sidx) ? 0 : sidx;
		state.fidx = isNaN(fidx) ? 0 : fidx;
	    }
	}
    }    

    renderSlide(slides, state, mkState(-1,-1));
    
    /* Keyboard navigation */
    document.addEventListener('keydown', function(event){
	if(event.key == 'j' || event.key === "ArrowRight" || event.key === "ArrowDown"){ event.preventDefault(); state = nextSlide(slides, state);}
        if(event.key == 'k' || event.key === "ArrowLeft" || event.key === "ArrowUp"){ event.preventDefault(); state = prevSlide(slides, state); };
    });

    /* Control Navigation */
    var divControl = document.createElement("div");
    divControl.id = "monoski-controler";
    var buttonPrev = document.createElement("button");
    var buttonNext = document.createElement("button");
    var buttonPrint = document.createElement("button");

    buttonPrev.innerHTML = "<";
    buttonPrint.innerHTML = "🖨";
    buttonNext.innerHTML = ">";
    
    divControl.append(buttonPrev);
    divControl.append(buttonPrint);
    divControl.append(buttonNext);

    buttonPrev.addEventListener('click', function(e) { state = prevSlide(slides, state)});
    buttonNext.addEventListener('click', function(e) { state = nextSlide(slides, state)});

    buttonPrint.addEventListener('click', function(e) { window.print(); });
    document.body.appendChild(divControl);


});
