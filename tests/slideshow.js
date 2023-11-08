import {SlideShow} from '../modules/slideshow.js';

describe('SlideShow', function() {
    function create_slideshow() {
        const slideshow = document.implementation.createHTMLDocument('Test');
        const code = `
            <!--************************ Slide **************************-->
            <article id="title">
             <section>
              <h1>Presentaci&oacute;ns en <code>html</code></h1>
              <h2>Emprego deste paquete</h2>
              <footer>
               <ul>
                <li>Author Name</li>
                <li><time datetime="2023-11-08">8 November 2023</time></li>
               </ul>
              </footer>
             </section>
            </article>
            <!--************************ Slide **************************-->
            <article>
             <header></header>
             <section>
              <p class="show-30 erase-40">Third</p>
              <p>Static <span class="animate-10">animated</span></p>
              <p class="mystyle show-10 erase-20">
               First <span class="animate-30">animated</span></p>
              <p class="animate-40">Fourth</p>
              <p class="show-20">
               Second <span class="animate-30 erase-40">animated 2</span></p>
              <p class="show-30">Also third</p>
             </section>
            <article>
        `;
        const main = slideshow.createElement('main')
        main.innerHTML = code;
        slideshow.body.appendChild(main)
        return new SlideShow(slideshow);
    }

    describe('Test slideshow from example code', function() {
        it('Starts at first slide by default', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            assert.equal(slideshow.index, 0);
        })

        it('Only next button created in title', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            const found = slideshow.current.slide.querySelectorAll('button');
            const buttons = Array.from(found);
            assert.equal(buttons.length, 1);
            assert.equal(buttons[0].id, 'button-next');
            const parent = buttons[0].parentNode.nodeName.toLowerCase();
            assert.equal(parent, 'footer');
        })

        it('Three buttons created in second slide', function() {
            const slideshow = create_slideshow();
            slideshow.start(1);
            const found = slideshow.current.slide.querySelectorAll('button');
            const buttons = Array.from(found);
            const nav = buttons[0].parentNode;
            assert.equal(buttons.length, 3);
            assert.equal(nav.nodeName.toLowerCase(), 'nav');
            assert.equal(nav.parentNode.nodeName.toLowerCase(), 'header');
            assert.equal(buttons[0].id, 'button-back');
            assert.equal(buttons[1].id, 'button-next');
            assert.equal(buttons[2].id, 'button-contents');
        })

        it('No animations in title', function() {
            const slideshow = create_slideshow();
            slideshow.start();
            const title = slideshow.current;
            assert.equal(title.get_steps().length, 0);
        })
    })
})
