import {SlideShow} from '../modules/slideshow.js';


describe('SlideShow', function() {
    function create_slideshow() {
        const slideshow = document.implementation.createHTMLDocument('Test');
        const code = `
            <!--************************ Slide **************************-->
            <article id="title">
             <section>
              <h1>Title of presentation</h1>
              <h2>Subtitle</h2>
              <footer>
               <ul>
                <li>Author Name</li>
                <li><time datetime="2023-11-08">8 November 2023</time></li>
               </ul>
              </footer>
             </section>
            </article>
            <!--********************** Slide ****************************-->
            <article id="contents">
             <header>
              <h1>Contents</h1>
             </header>
             <section>
              <h1><a href="#first">First slide</a></h1>
              <h1><a href="#second">Second slide</a></h1>
             </section>
            </article>
            <!--************************ Slide **************************-->
            <article id="first">
             <header></header>
             <section>
              <p class="show-30 erase-40">Third</p>
              <p>Static <span class="animation-example animate-10">animated</span></p>
              <p class="mystyle show-10 erase-20">
               First <span class="animation-example animate-30">animated</span></p>
              <p class="animation-example animate-40">Fourth</p>
              <p class="show-20">
               Second <span class="animation-example animate-30 erase-40">animated 2</span></p>
              <p class="show-30">Also third</p>
             </section>
            </article>
            <!--************************ Slide **************************-->
            <article id="second">
             <header></header>
             <section>
              <p>Text</p>
              <p class="show-30">First</p>
             </section>
            </article>
        `;
        const main = slideshow.createElement('main');
        main.innerHTML = code;
        slideshow.body.append(main);
        return new SlideShow(slideshow);
    }

    function get_class(slide, cls) {
        return Array.from(slide.slide.querySelectorAll(cls))
    }
    
    const get_shown = (slide) => get_class(slide, '.shown');
    const get_animated = (slide) => get_class(slide, '.animated');
    const get_erased = (slide) => get_class(slide, '.erased');
    
    function get_text(element) {
        return element.innerText.trim();
    }
    
    function move_slideshow({forward = 0, backwards = 0}) {
        const slideshow = create_slideshow();
        slideshow.start(0);
        for (let i=0; i<forward; i++) 
            slideshow.move_forward();
        for (let i=0; i<backwards; i++) 
            slideshow.move_backwards();
        return slideshow;
    }

    function press_key(slideshow, code, alt=false) {
        const key = {'code': code, 'altKey': alt};
        const event = new KeyboardEvent('keydown', key);
        return slideshow._document.dispatchEvent(event)
    }

    describe('Test slideshow from example code', function() {
        it('Start at first slide', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            assert.equal(slideshow.index, 0);
        })

        it('Only next button created in title', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            const found = slideshow.current.slide.querySelectorAll('button');
            const buttons = Array.from(found);
            assert.equal(buttons.length, 1);
            assert.equal(buttons[0].id, 'button-next');
            const parent = buttons[0].parentNode.nodeName.toLowerCase();
            assert.equal(parent, 'footer');
        })

        it('There may be no title slide', function() {
            const doc = document.implementation.createHTMLDocument('Test');
            const code = `
                <article>
                 <section>
                  <p>Text</p>
                 </section>
                </article>
            `;
            const main = doc.createElement('main');
            main.innerHTML = code;
            doc.body.appendChild(main)
            const slideshow = new SlideShow(doc);
            slideshow.start(0);
            const slide = slideshow.current.slide; 
            assert.equal(slide.nodeName.toLowerCase(), 'article');
        })

        it('Four buttons created in second slide', function() {
            const slideshow = create_slideshow();
            slideshow.start(1);
            const found = slideshow.current.slide.querySelectorAll('button');
            const buttons = Array.from(found);
            const nav = buttons[0].parentNode;
            assert.equal(buttons.length, 4);
            assert.equal(nav.nodeName.toLowerCase(), 'nav');
            assert.equal(nav.parentNode.nodeName.toLowerCase(), 'header');
            assert.equal(buttons[0].id, 'button-back');
            assert.equal(buttons[1].id, 'button-next');
            assert.equal(buttons[2].id, 'button-scribble');
            assert.equal(buttons[3].id, 'button-contents');
        })

        it('No animations in title', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            const title = slideshow.current;
            assert.equal(title.get_steps().length, 0);
        })

        it('Move 1: slide 2 contents', function() {
            const slideshow = move_slideshow({forward: 1});
            assert.equal(slideshow.index, 1);
            const article = slideshow.current.slide;
            assert.equal(article.id, 'contents');
        })

        it('Move 2: slide 3', function() {
            const slideshow = move_slideshow({forward: 2});
            assert.equal(slideshow.index, 2);
        })

        it('Move 3: slide 3, show 1, animate 1', function() {
            const slideshow = move_slideshow({forward: 3});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
            const erased = get_erased(slide);
            assert.equal(erased.length, 0);
        })

        it('Move 4: slide 3, show 2, animate 1, erase 1', function() {
            const slideshow = move_slideshow({forward: 4});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(get_text(shown[1]), 'Second animated 2');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
            assert.equal(get_text(erased[0]), 'First animated');
        })

        it('Move 5: one element shown and erased', function() {
            const slideshow = move_slideshow({forward: 5});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            const erased = get_erased(slide);
            assert.equal(get_text(shown[1]), get_text(erased[0]));
        })

        it('Move 5: slide 3, show 4, animate 3, erase 1', function() {
            const slideshow = move_slideshow({forward: 5});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Move 6: slide 3, show 4, animate 4, erase 3', function() {
            const slideshow = move_slideshow({forward: 6});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it('Move 7: slide 4', function() {
            const slideshow = move_slideshow({forward: 7});
            assert.equal(slideshow.index, 3);
        })

        it('Move 8: slide 4, show 1', function() {
            const slideshow = move_slideshow({forward: 8});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First');
        })

        it('Move 9: end (same as move 8)', function() {
            const slideshow = move_slideshow({forward: 9});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First');
        })

        it('Back 1: start (same as nothing)', function() {
            const slideshow = move_slideshow({backwards: 1});
            assert.equal(slideshow.index, 0);
        })

        it('Move 1, Back 1: start', function() {
            const slideshow = move_slideshow({forward: 1, backwards: 1});
            assert.equal(slideshow.index, 0);
        })

        it('Move 6, Back 6: start', function() {
            const slideshow = move_slideshow({forward: 6, backwards: 6});
            assert.equal(slideshow.index, 0);
        })

        it('Move 3, Back 6: start', function() {
            const slideshow = move_slideshow({forward: 6, backwards: 6});
            assert.equal(slideshow.index, 0);
        })

        it('Move 7, back 2: slide 3, show 4, animate 3, erase 1', function() {
            const slideshow = move_slideshow({forward: 7, backwards: 2});
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Start slide 3, move 3: show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(2);
            slideshow.move_forward();
            slideshow.move_forward();
            slideshow.move_forward();
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Change slide 3, move 3: show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(2);
            slideshow.move_forward();
            slideshow.move_forward();
            slideshow.move_forward();
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Change slide 3, back 1: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(2);
            slideshow.move_backwards();
            assert.equal(slideshow.index, 1);
        })

        it('Slide 4, back 1: slide 3, show 4, animate 4, erase 3', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            slideshow.move_backwards();
            assert.equal(slideshow.index, 2);
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it(
            'Slide 4, move 1, back 2: slide 3, show 4, animate 4, erase 3', 
            function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            slideshow.move_forward();
            slideshow.move_backwards();
            slideshow.move_backwards();
            assert.equal(slideshow.index, 2);
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it('Move home: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.move_home();
            assert.equal(slideshow.index, 1);
        })

        it('Slide 4, move 2, move home: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            slideshow.move_forward();
            slideshow.move_forward();
            slideshow.move_home();
            assert.equal(slideshow.index, 1);
        })

        it('Move first: slide 1', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.move_first();
            assert.equal(slideshow.index, 0);
        })

        it('Slide 4, move 2, move first: slide 1', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            slideshow.move_forward();
            slideshow.move_forward();
            slideshow.move_first();
            assert.equal(slideshow.index, 0);
        })

        it('Move end: slide 4', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.move_end();
            assert.equal(slideshow.index, 3);
        })

        it('Slide 2, move 2, move end: slide 4', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(1);
            slideshow.move_forward();
            slideshow.move_forward();
            slideshow.move_end();
            assert.equal(slideshow.index, 3);
        })

        it('Next slide 2, back 1: show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.next_slide();
            slideshow.next_slide();
            slideshow.move_backwards();
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it(
            `Next slide 3, previous slide 1, back 1: 
            show 4, animate 3, erase 1`, function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.next_slide();
            slideshow.next_slide();
            slideshow.next_slide();
            slideshow.previous_slide();
            slideshow.move_backwards();
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Next slide 5: end', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.next_slide();
            slideshow.next_slide();
            slideshow.next_slide();
            slideshow.next_slide();
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First');
        })

        it('Previous slide 2: start', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.previous_slide();
            slideshow.previous_slide();
            assert.equal(slideshow.index, 0);
        })
    })

    describe('Test slideshow from example code with keyboard', function() {
        it('Start at first slide', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            assert.equal(slideshow.index, 0);
        })

        it('Move 1: slide 2 contents', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'ArrowRight')
            assert.equal(slideshow.index, 1);
            const article = slideshow.current.slide;
            assert.equal(article.id, 'contents');
        })

        it('Move 2: slide 3', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'ArrowRight')
            press_key(slideshow, 'ArrowRight')
            assert.equal(slideshow.index, 2);
        })

        it('Move 3: slide 3, show 1, animate 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'ArrowRight')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First animated');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            assert.equal(get_text(animated[0]), 'animated');
            const erased = get_erased(slide);
            assert.equal(erased.length, 0);
        })

        it('Move 4: slide 3, show 2, animate 1, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 4; i++)
                press_key(slideshow, 'ArrowRight')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(get_text(shown[1]), 'Second animated 2');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
            assert.equal(get_text(erased[0]), 'First animated');
        })

        it('Move 9: end (same as move 8)', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 9; i++)
                press_key(slideshow, 'ArrowRight')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First');
        })

        it('Back 1: start (same as nothing)', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'ArrowLeft')
            assert.equal(slideshow.index, 0);
        })

        it('Move 1, Back 1: start', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'ArrowRight')
            press_key(slideshow, 'ArrowLeft')
            assert.equal(slideshow.index, 0);
        })

        it('Move 6, Back 6: start', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 6; i++)
                press_key(slideshow, 'ArrowRight')
            for (let i = 0; i < 6; i++)
                press_key(slideshow, 'ArrowLeft')
            assert.equal(slideshow.index, 0);
        })

        it('Move 3, Back 6: start', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'ArrowRight')
            for (let i = 0; i < 6; i++)
                press_key(slideshow, 'ArrowLeft')
            assert.equal(slideshow.index, 0);
        })

        it('Move 7, back 2: slide 3, show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 7; i++)
                press_key(slideshow, 'ArrowRight')
            for (let i = 0; i < 2; i++)
                press_key(slideshow, 'ArrowLeft')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Move 7, back 2 with [Enter]', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 7; i++)
                press_key(slideshow, 'Enter')
            for (let i = 0; i < 2; i++)
                press_key(slideshow, 'ArrowLeft')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Move 7, back 2 with [Space]', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            for (let i = 0; i < 7; i++)
                press_key(slideshow, 'Space')
            for (let i = 0; i < 2; i++)
                press_key(slideshow, 'ArrowLeft')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Start slide 3, move 3: show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(2);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'ArrowRight')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Start slide 3, move 3 with [Enter]', function() {
            const slideshow = create_slideshow();
            slideshow.start(2);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'Enter')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Start slide 3, move 3 with [Space]', function() {
            const slideshow = create_slideshow();
            slideshow.start(2);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'Space')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Change slide 3, move 3: show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.change_slide(2);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'ArrowRight')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Change slide 3, move 3 with [Enter]', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.change_slide(2);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'Enter')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Change slide 3, move 3 with [Space]', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            slideshow.change_slide(2);
            for (let i = 0; i < 3; i++)
                press_key(slideshow, 'Space')
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Change slide 3, back 1: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(2);
            press_key(slideshow, 'ArrowLeft')
            assert.equal(slideshow.index, 1);
        })

        it('Slide 4, back 1: slide 3, show 4, animate 4, erase 3', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            press_key(slideshow, 'ArrowLeft')
            assert.equal(slideshow.index, 2);
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it('[Home]: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            press_key(slideshow, 'Home')
            assert.equal(slideshow.index, 1);
        })

        it('Slide 4, move 2, [Home]: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            press_key(slideshow, 'ArrowLeft')
            press_key(slideshow, 'ArrowLeft')
            press_key(slideshow, 'Home')
            assert.equal(slideshow.index, 1);
        })

        it('[Control+Home]: slide 1', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            const key = {'code': 'Home', 'ctrlKey': true, 'altKey': false};
            const event = new KeyboardEvent('keydown', key);
            slideshow._document.dispatchEvent(event);
            assert.equal(slideshow.index, 0);
        })

        it('Slide 4, move 2, [Control+Home]: slide 1', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(3);
            press_key(slideshow, 'ArrowLeft')
            press_key(slideshow, 'ArrowLeft')
            const key = {'code': 'Home', 'ctrlKey': true, 'altKey': false};
            const event = new KeyboardEvent('keydown', key);
            slideshow._document.dispatchEvent(event);
            assert.equal(slideshow.index, 0);
        })

        it('[End]: slide 4', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            press_key(slideshow, 'End')
            assert.equal(slideshow.index, 3);
        })

        it('Slide 2, move 2, [End]: slide 4', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            slideshow.change_slide(1);
            press_key(slideshow, 'ArrowLeft')
            press_key(slideshow, 'ArrowLeft')
            press_key(slideshow, 'End')
            assert.equal(slideshow.index, 3);
        })

        it('[PageDown] 2, back 1: show 4, animate 3, erase 1', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'ArrowLeft');
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it(
            `[PageDown] 3, [PageUp] 1, back 1: 
            show 4, animate 3, erase 1`, function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageUp');
            press_key(slideshow, 'ArrowLeft');
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('[PageDown] 5: end', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 1);
            assert.equal(get_text(shown[0]), 'First');
        })

        it('[PageUp] 2: start', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'PageUp');
            press_key(slideshow, 'PageUp');
            assert.equal(slideshow.index, 0);
        })
    })

    describe('Toggle behaviour of PageDown/PageUp', function() {
        function press_control_alt_A(slideshow) {
            const key = {'code': 'KeyA', 'ctrlKey': true, 'altKey': true};
            const event = new KeyboardEvent('keydown', key);
            return slideshow._document.dispatchEvent(event);
        }

        it('Default behaviour is going to next slide', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'ArrowLeft');
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Default behaviour with Alt is going to next slide', function() {
            const slideshow = create_slideshow();
            slideshow.start(0);
            press_key(slideshow, 'PageDown', true);
            press_key(slideshow, 'PageDown', true);
            press_key(slideshow, 'ArrowLeft', true);
            const slide = slideshow.current;
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            assert.equal(get_text(shown[0]), 'Third');
            assert.equal(get_text(shown[3]), 'Also third');
            const animated = get_animated(slide);
            assert.equal(animated.length, 3);
            assert.equal(get_text(animated[1]), 'animated');
            assert.equal(get_text(animated[2]), 'animated 2');
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
        })

        it('Default [PageDown] 3: slide 3', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            assert.equal(slideshow.index, 3);
        })

        it('Default start 3, [PageUp]: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start(3);
            press_key(slideshow, 'PageUp');
            assert.equal(slideshow.index, 2);
        })

        it('[Control+Alt+A] [PageDown] 3: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            press_control_alt_A(slideshow);
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            press_key(slideshow, 'PageDown');
            assert.equal(slideshow.index, 2);
        })

        it('[Control+Alt+A] start 3, [->] [PageUp]: slide 3', function() {
            const slideshow = create_slideshow();
            slideshow.start(3);
            press_control_alt_A(slideshow);
            press_key(slideshow, 'ArrowRight');
            press_key(slideshow, 'PageUp');
            assert.equal(slideshow.index, 3);
        })

        it('[Control+Alt+A] [Alt+PageDown] 3: slide 3', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            press_control_alt_A(slideshow);
            press_key(slideshow, 'PageDown', true);
            press_key(slideshow, 'PageDown', true);
            press_key(slideshow, 'PageDown', true);
            assert.equal(slideshow.index, 3);
        })

        it('[Control+Alt+A] start 3, [->] [Alt+PageUp]: slide 2', function() {
            const slideshow = create_slideshow();
            slideshow.start(3);
            press_control_alt_A(slideshow);
            press_key(slideshow, 'ArrowRight');
            press_key(slideshow, 'PageUp', true);
            assert.equal(slideshow.index, 2);
        })

        it('[Control+Alt+A] 2, [Alt+PageDown] 3: slide 3', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            press_control_alt_A(slideshow);
            press_key(slideshow, 'PageDown', true);
            press_key(slideshow, 'PageDown', true);
            press_key(slideshow, 'PageDown', true);
            assert.equal(slideshow.index, 3);
        })

        it('Start 3, [Control+Alt+A] 2, [->] [Alt+PageUp]: slide 2', () => {
            const slideshow = create_slideshow();
            slideshow.start(3);
            press_control_alt_A(slideshow);
            press_control_alt_A(slideshow);
            press_key(slideshow, 'ArrowRight');
            press_key(slideshow, 'PageUp', true);
            assert.equal(slideshow.index, 2);
        })
    })

    describe('Print mode', function() {
        function get_animations() {
            const slideshow = create_slideshow();
            slideshow.print_mode();
            const slides = slideshow._document.querySelectorAll('article')
            return Array.from(slides);
        }

        function get_class(slide, cls) {
            return Array.from(slide.querySelectorAll(cls))
        }
        
        const get_shown = (slide) => get_class(slide, '.shown');
        const get_animated = (slide) => get_class(slide, '.animated');
        const get_erased = (slide) => get_class(slide, '.erased');
        
        function get_text(element) {
            return element.innerText.trim();
        }
        
        it('9 slides are produced', function() {
            const slides = get_animations();
            assert.equal(slides.length, 9);
        })

        it('Article 5: slide 3, show 2, animate 1, erase 1', function() {
            const slides = get_animations();
            const slide = slides[4];
            const shown = get_shown(slide);
            assert.equal(shown.length, 2);
            assert.equal(get_text(shown[1]), 'Second animated 2');
            const animated = get_animated(slide);
            assert.equal(animated.length, 1);
            const erased = get_erased(slide);
            assert.equal(erased.length, 1);
            assert.equal(get_text(erased[0]), 'First animated');
        })

        it('Article 7: slide 3, show 4, animate 4, erase 3', function() {
            const slides = get_animations();
            const slide = slides[6];
            const shown = get_shown(slide);
            assert.equal(shown.length, 4);
            const animated = get_animated(slide);
            assert.equal(animated.length, 4);
            assert.equal(get_text(animated[2]), 'Fourth');
            const erased = get_erased(slide);
            assert.equal(erased.length, 3);
            assert.equal(get_text(erased[0]), 'Third');
            assert.equal(get_text(erased[2]), 'animated 2');
        })

        it('No transitions: there are 4 slides', function() {
            const slideshow = create_slideshow();
            let slides = slideshow._document.getElementsByTagName('article')
            assert.equal(Array.from(slides).length, 4);
        })

        it('No transitions, slide 3: show 4, animate 4, erase 3', function() {
            const slideshow = create_slideshow();
            const slides = slideshow._document.getElementsByTagName('article')
            const slide = Array.from(slides)[2];
            const shown = get_shown(slide);
            assert.equal(shown.length, 0);
            const animated = get_animated(slide);
            assert.equal(animated.length, 0);
            const erased = get_erased(slide);
            assert.equal(erased.length, 0);
        })
    })

    describe('Configurations of the slide show', () => {
        function styled_slideshow() {
            const slideshow = document.implementation.createHTMLDocument('');
            const style = slideshow.documentElement.style;
            style.setProperty('--slide-ratio', '2');
            style.setProperty('--alt-slide-ratio', '1');
            style.setProperty('--text-size', '5');
            style.setProperty('--alt-text-size', '4.5');
            style.setProperty('--side-margin', '2.5em');
            style.setProperty('--alt-side-margin', '1em');
            const code = `
                <article id="title">
                <section>
                <h1>Title of presentation</h1>
                <h2>Subtitle</h2>
                </article>
            `;
            const main = slideshow.createElement('main');
            main.innerHTML = code;
            slideshow.body.append(main);
            return new SlideShow(slideshow);
        }

        function press_control_alt_R(slideshow) {
            const key = {'code': 'KeyR', 'ctrlKey': true, 'altKey': true};
            const event = new KeyboardEvent('keydown', key);
            return slideshow._document.dispatchEvent(event);
        }

        it('Regular values of ratio, text size, and margin', () => {
            const slideshow = styled_slideshow();
            slideshow.start(0);
            const root = slideshow._document.documentElement;
            const style = window.getComputedStyle(root);
            const ratio = style.getPropertyValue('--slide-ratio');
            assert.equal(ratio, '2')
            const text_size = style.getPropertyValue('--text-size');
            assert.equal(text_size, '5')
            const margin = style.getPropertyValue('--side-margin');
            assert.equal(margin, '2.5em')
        })

        it('[Control+Alt+R] changes aspect ratio', () => {
            const slideshow = styled_slideshow();
            slideshow.start(0);
            press_control_alt_R(slideshow);
            const root = slideshow._document.documentElement;
            const style = window.getComputedStyle(root);
            const ratio = style.getPropertyValue('--slide-ratio');
            assert.equal(ratio, '1')
            const text_size = style.getPropertyValue('--text-size');
            assert.equal(text_size, '4.5')
            const margin = style.getPropertyValue('--side-margin');
            assert.equal(margin, '1em')
        })

        it('[Control+Alt+R] 2: back to normal', () => {
            const slideshow = styled_slideshow();
            slideshow.start(0);
            press_control_alt_R(slideshow);
            press_control_alt_R(slideshow);
            const root = slideshow._document.documentElement;
            const style = window.getComputedStyle(root);
            const ratio = style.getPropertyValue('--slide-ratio');
            assert.equal(ratio, '2')
            const text_size = style.getPropertyValue('--text-size');
            assert.equal(text_size, '5')
            const margin = style.getPropertyValue('--side-margin');
            assert.equal(margin, '2.5em')
        })
    })
})
