/*
  Generate fragments of DOM-node s, slide number is i
*/
function generate_fragments(s,i,n) {
    // Compute index for fragment without index: rank of the fragment in DOM order (for nodes wo specified index)
    // Nodes with current-fragment are displayed from the beginning.
    s.querySelectorAll(".fragment:not(.fragment[data-fragment-index], .current-fragment)").forEach( function(e,i,t) {
	e.setAttribute("data-fragment-index",i+1)
    });
    // Map each fragment index to its set of fragments
    var frObj = {};
    s.querySelectorAll(".fragment[data-fragment-index]").forEach( f =>
	f.getAttribute("data-fragment-index").split(" ").forEach(k => Object.hasOwn(frObj,k) ? frObj[k].push(f) : frObj[k] = [f])
    );

    // Sorting fragment Keys 
    var frKeys = Object.keys(frObj).sort();

    // Slide number box
    var divSlideNumber = document.createElement("div");
    divSlideNumber.innerHTML = `${i}/${n}`;
    divSlideNumber.classList.add("slide-number");
    s.appendChild(divSlideNumber);    
    
    // Generate every fragment and add them next to s
    frKeys.forEach(function(k,j) {
	s.before(s.cloneNode(true)); // add a clone of current slide
	divSlideNumber.innerHTML = `${i}.${j+1}/${n}`; // slide number: add fragment
	s.querySelectorAll(".current-fragment").forEach(
	    function (e) { e.classList.remove("current-fragment"); e.classList.add("fragment-visited")} 
	); // modify s by removing current-fragment and adding visited-fragment classes
	frObj[k].forEach(f=>f.classList.add("current-fragment")); // add current-fragment class to new fragments
    });
}

document.addEventListener("DOMContentLoaded", function (e) {
    // Generate fragments of every slide
    document.querySelectorAll(".slide").forEach((s,i,t) => generate_fragments(s,i+1,t.length));

    /* URL mecanism for sharing */
    var hashW = window.location.hash.substring(1);
    var current = 0;    
    if (hashW != "") {
	if (hashW[0] == "/") {
	    var p = parseInt(hashW.substring(1));
	    current = isNaN(p) ? 0 : p;
	}
    }    
	
    /* function update slide */
    function update_slide(current,slides) {
        if(current < 0){ current = 0; }
        if(current >= slides.length){ current = slides.length - 1; }
        slides[current].scrollIntoView();
//	window.location.hash = `/${current}`;
    };

    var slides = document.querySelectorAll(".slide");
    update_slide(current,slides);
    
    /* Keyboard navigation */
    document.addEventListener('keydown', function(event){
        if(event.key == 'j' || event.key === "ArrowRight"){ current = current >= slides.length-1 ? slides.length-1 : current+1 }
        if(event.key == 'k' || event.key === "ArrowLeft"){ current = current <= 0 ? 0 : current-1; }
	update_slide(current,slides);
    });


    /* Scrolling navigation */
    /* Keep track of slide number when user manually scroll */
    /* Implicitly handle index.html#idslide redirection! */
    /* BEWARE: assume slides are vertically aligned */
    addEventListener("scroll", function(event) {
	console.log("scrolled");
	current = Math.floor(window.scrollY/window.innerHeight);
	window.location.hash = `/${current}`;
    });
});
