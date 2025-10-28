
import './App.css';
import React, { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import ScrollReveal from "scrollreveal";
function App() {
  const settings = {
    slidesToShow: 6,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: false,
    infinite: true,
    swipe: true,
    draggable: true,
    touchMove: true,
    swipeToSlide: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: { slidesToShow: 4 },
      },
      {
        breakpoint: 767,
        settings: { slidesToShow: 2 },
      },
    ],
  };
   useEffect(() => {
    const sr = ScrollReveal();

    sr.reveal(".myImage", {
      duration: 1500,
      origin: "left",
      distance: "0px",
      opacity: 0,
      scale: 1,
      easing: "ease-in-out",
      reset: false,
      interval: 200,
      beforeReveal: (el) => {
        el.classList.add("reveal"); // adds the CSS class when visible
      },
    });
  }, []);

    useEffect(() => {
      AOS.init({
      once: true, // animations trigger only once
      duration: 1000, // default animation duration
      easing: "ease-in-out",
    });
    // ========== splitLetters ==========
    function splitLetters(node, delayStart = 0.0) {
      let delay = delayStart;
      const fragment = document.createDocumentFragment();

      node.childNodes.forEach((child) => {
        if (child.nodeType === 3) {
          for (let char of child.textContent) {
            if (char === " ") {
              fragment.appendChild(document.createTextNode(char));
            } else {
              const span = document.createElement("span");
              span.className = "letter";
              span.dataset.delay = delay.toFixed(2);
              span.textContent = char;
              fragment.appendChild(span);
              delay += 0.05;
            }
          }
        } else if (child.nodeType === 1) {
          const newChild = child.cloneNode(false);
          const { newDelay, contentFragment } = splitLetters(child, delay);
          newChild.appendChild(contentFragment);
          fragment.appendChild(newChild);
          delay = newDelay;
        }
      });

      return { newDelay: delay, contentFragment: fragment };
    }

    document.querySelectorAll(".typing-container").forEach((container) => {
      const { contentFragment } = splitLetters(container);
      container.innerHTML = "";
      container.appendChild(contentFragment);
    });

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const letters = entry.target.querySelectorAll(".letter");
            setTimeout(() => {
              letters.forEach((letter) => {
                letter.style.animation = `fadeUp 0.3s forwards`;
                letter.style.animationDelay = letter.dataset.delay + "s";
              });
            }, 1000);
            obs.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".typing-container").forEach((el) => observer.observe(el));

    // ========== Accordion ==========
    document.querySelectorAll(".accordion-button").forEach((button) => {
      button.addEventListener("click", function (e) {
        const target = document.querySelector(this.getAttribute("data-bs-target"));
        if (target.classList.contains("show")) {
          const collapseInstance = window.bootstrap.Collapse.getInstance(target);
          collapseInstance.hide();
          e.stopPropagation();
        }
      });
    });

    // ========== Parallax ==========
    const parallaxElement = document.querySelector(".parallax");
    function applyParallaxEffect() {
      const backgroundPosition = "center " + window.scrollY * -0.3 + "px";
      if (parallaxElement) parallaxElement.style.backgroundPosition = backgroundPosition;
    }
    window.addEventListener("scroll", applyParallaxEffect);
    applyParallaxEffect();

    // ========== Dot Cursor ==========
    const dot = document.getElementById("dotz");
    const hideDotClasses = ["no-dot"];
    document.addEventListener("mousemove", (e) => {
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const hide = hideDotClasses.some((cls) => el?.classList.contains(cls));
      if (dot) {
        if (hide) {
          dot.style.display = "none";
        } else {
          dot.style.display = "block";
          dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
      }
    });

    // ========== Counter ==========
    function animateCounter(counter) {
      const destination = parseInt(counter.getAttribute("data-destination"));
      let current = 0;
      const stepTime = 20;
      const increment = Math.ceil(destination / 100);
      const interval = setInterval(() => {
        current += increment;
        if (current > destination) current = destination;
        counter.textContent = current;
        if (current >= destination) clearInterval(interval);
      }, stepTime);
    }

    const counterObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll(".counter").forEach((counter) => counterObserver.observe(counter));

    // ========== Loader ==========
    function hideLoaderAndShowContent() {
      document.getElementById("loader").style.display = "none";
      document.getElementById("content").style.display = "block";
      const loaderDoneEvent = new CustomEvent("loader-done");
      window.dispatchEvent(loaderDoneEvent);
    }
    window.addEventListener("load", () => {
      setTimeout(hideLoaderAndShowContent, 1000);
    });

    // ========== Ripple Button ==========
    const buttons = document.querySelectorAll(".ripple-btn");
    buttons.forEach((button) => {
      button.innerHTML = `<span style="position:relative;z-index:1;">
        ${button.getAttribute("data-text")} <i class="fas fa-arrow-right"></i>
      </span>`;

      let ripple = null;
      button.addEventListener("mouseenter", (e) => {
        const rect = button.getBoundingClientRect();
        ripple = document.createElement("span");
        ripple.className = "ripple";
        ripple.style.left = `${e.clientX - rect.left - 15}px`;
        ripple.style.top = `${e.clientY - rect.top - 15}px`;
        button.appendChild(ripple);
        setTimeout(() => ripple.classList.add("active"), 10);
      });

      button.addEventListener("mouseleave", () => {
        if (ripple) {
          ripple.style.opacity = "0";
          ripple.style.transition = "opacity 0.5s ease";
          setTimeout(() => {
            ripple.remove();
            ripple = null;
          }, 500);
        }
      });
    });
  }, []);
  return (
    <div className="App margin bg-1">
      <>
  {/* Hello world */}
  <div id="loader">
    <div className="spinner-wrapper">
      <img
        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/favicon.png"
        alt="Loading..."
      />
      <div className="semi-circle" />
    </div>
  </div>
  <div id="content">
    <div className="flotz">
      <div className="flotz1 z1">
        <i className="fa-solid fa-file" />
      </div>
      <div className="flotz1">
        <i className="fa-solid fa-cart-shopping" />
      </div>
    </div>
    <div className="dotz" id="dotz" />
    <div className="topbar py-21 radus">
      <div
        className="container-fluid d-flex 
               justify-content-center justify-content-md-between 
               align-items-center "
      >
        <div className="ad gh" style={{ paddingLeft: 5 }}>
          <span className="me-3 og-h">
            <i className="bi bi-telephone og" /> &nbsp;&nbsp;+
            (123)-456-789&nbsp;&nbsp;&nbsp;&nbsp;
          </span>
          <span className="og-h">
            <i className="bi bi-envelope og" />
            &nbsp;&nbsp; info@domainname.com
          </span>
        </div>
        <div
          className="d-none d-md-block gh"
          style={{ paddingRight: 5, display: "flex", flexDirection: "row" }}
        >
          <a href="#" className="me-3">
            <i className="bi bi-instagram og-h" />
          </a>
          <a href="#" className="me-3">
            <i className="bi bi-facebook og-h" />
          </a>
          <a href="#" className="me-3">
            <i className="bi bi-globe og-h" />
          </a>
          <span>| &nbsp;&nbsp;&nbsp;&nbsp;Follow Us On Socials</span>
        </div>
      </div>
    </div>
    <nav className="navbar navbar-expand-xl bg-1 gg1">
      <div className="container-fluid top-2 radus jjj">
        <a className="navbar-brand d-flex align-items-center" href="#">
          <img
            src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/logo.svg"
            alt="logo"
            className="me-2 logo-top"
          />
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="offcanvas"
          data-bs-target="#mobileMenu"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={30}
            height={30}
            fill="white"
            className="bi bi-list"
            viewBox="0 0 16 16"
          >
            <path
              fillRule="evenodd"
              d="M2 12.5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5zm0-5a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5z"
            />
          </svg>
        </button>
        <div className="collapse navbar-collapse justify-content-center">
          <ul className="navbar-nav mb-2 mb-lg-0 f16">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle active"
                href="#"
                data-bs-toggle="dropdown"
              >
                Home
                <i className="fas fa-chevron-down fa-xs" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a
                    className="dropdown-item bk"
                    href="./index.html"
                    style={{ color: "black" }}
                  >
                    Home-Main
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Home-Vedio
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Home-Slider
                  </a>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="./About.html">
                About Us
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="./Service.html">
                Services
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">
                Blog
              </a>
            </li>
            {/* Pages Dropdown */}
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                data-bs-toggle="dropdown"
              >
                Pages <i className="fas fa-chevron-down fa-xs" />
              </a>
              <ul className="dropdown-menu">
                <li>
                  <a className="dropdown-item" href="./Pages.html">
                    Service Details
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Blog Details
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Our Team
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Team Details
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Pricing Plan
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Our Testimonials
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Image Gallery
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    Video Gallery
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    FAQS
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    404
                  </a>
                </li>
                {/* Header Layout Submenu */}
                {/* Header Layout Submenu */}
                <li className="dropdown-submenu">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    Header Layout{" "}
                    <i className="fas fa-chevron-right fa-xs gu" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Header Layout 1
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Header Layout 2
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Header Layout 3
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Header Layout 4
                      </a>
                    </li>
                  </ul>
                </li>
                {/* Footer Layout Submenu */}
                <li className="dropdown-submenu">
                  <a className="dropdown-item dropdown-toggle" href="#">
                    Footer Layout&nbsp;{" "}
                    <i className="fas fa-chevron-right fa-xs gu" />
                  </a>
                  <ul className="dropdown-menu">
                    <li>
                      <a className="dropdown-item" href="#">
                        Footer Layout 1
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Footer Layout 2
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Footer Layout 3
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Footer Layout 4
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="./Contact.html">
                Contact Us
              </a>
            </li>
          </ul>
        </div>
        <div className="d-none d-xl-block">
          <button className="ripple-btn m20 no-dot" data-text="Get Consult" />
        </div>
      </div>
    </nav>
    <div
      className="offcanvas offcanvas-start d-xl-none"
      tabIndex={-1}
      id="mobileMenu"
    >
      <div className="offcanvas-header">
        <button type="button" className="btn-close" data-bs-dismiss="offcanvas">
          &nbsp;
        </button>
      </div>
      <div className="offcanvas-body">
        <div className="line7 mt50" />
        <ul className="navbar-nav mt50">
          <li className="nav-item">
            <a
              className="nav-link mobile-dropdown-toggle"
              data-bs-toggle="collapse"
              href="#mobileHome"
            >
              Home
            </a>
            <div className="collapse mobile-submenu" id="mobileHome">
              <a href="./index.html">Home-Main</a>
              <a href="#">Home-Vedio</a>
              <a href="#">Home-Slider</a>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./About.html">
              About Us
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./Service.html">
              Services
            </a>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="#">
              Blog
            </a>
          </li>
          <li className="nav-item">
            <a
              className="nav-link mobile-dropdown-toggle"
              data-bs-toggle="collapse"
              href="#mobilePages"
            >
              Pages
            </a>
            <div className="collapse mobile-submenu" id="mobilePages">
              <a href="./Pages.html">Service Details</a>
              <a href="#">Blog Details</a>
              <a href="#">Our Team</a>
              <a href="#">Team Details</a>
              <a href="#">Pricing Plan</a>
              <a href="#">Our Testimonials</a>
              <a href="#">Image Gallery</a>
              <a href="#">Video Gallery</a>
              <a href="#">FAQS</a>
              <a href="#">404</a>
              {/* Nested submenu */}
              <a
                className="mobile-dropdown-toggle"
                data-bs-toggle="collapse"
                href="#mobileHeader"
              >
                Header Layout
              </a>
              <div className="collapse mobile-submenu" id="mobileHeader">
                <a href="#">Header Layout 1</a>
                <a href="#">Header Layout 2</a>
                <a href="#">Header Layout 3</a>
                <a href="#">Header Layout 4</a>
              </div>
              <a
                className="mobile-dropdown-toggle"
                data-bs-toggle="collapse"
                href="#mobileFooter"
              >
                Footer Layout
              </a>
              <div className="collapse mobile-submenu" id="mobileFooter">
                <a href="#">Footer Layout 1</a>
                <a href="#">Footer Layout 2</a>
                <a href="#">Footer Layout 3</a>
                <a href="#">Footer Layout 4</a>
              </div>
            </div>
          </li>
          <li className="nav-item">
            <a className="nav-link" href="./Contact.html">
              Contact Us
            </a>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <section className="parallax radus">
        <div className="hero-overlay radus">
          <div className="hero-content">
            <div
              className="btn1"
              style={{ width: 250 }}
              data-aos="fade-up"
              data-aos-delay={1000}
              data-aos-duration={500}
            >
              <p className="f14 clr1" style={{ color: "white" }}>
                {" "}
                <span className="dot" />
                Elevating the Equestrian Lifestyle
              </p>
            </div>
            <h1 className="f46 typing-container">
              Where riders and horses{" "}
              <span className="fontz"> thrive together</span>
            </h1>
            <p data-aos="fade-up" data-aos-delay={1000} data-aos-duration={800}>
              Our premier horse club provides top-tier training, care, and
              connection in a serene and supportive environment. Perfect for
              riders who seek more than just a ride.
            </p>
            <button
              className="ripple-btn white m20 no-dot"
              data-text="Enroll Today!"
              data-aos="fade-up"
              data-aos-delay={0}
              data-aos-duration={1000}
            />
            <div className=" parlax-cont2">
              <div
                className="line7 mt50 pt-s2"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={1500}
              />
              <div
                className="reviews"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={1500}
              >
                <div className="rc1" style={{ alignItems: "center" }}>
                  <div className="review-avatars">
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
                      alt="Rider 1"
                    />
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-2.jpg"
                      alt="Rider 2"
                    />
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-3.jpg"
                      alt="Rider 3"
                    />
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-4.jpg"
                      alt="Rider 4"
                    />
                    <span className="reviews-count">
                      <span className="counter" data-destination={5}>
                        0
                      </span>
                      K+
                    </span>
                  </div>
                  <div
                    className="review-text "
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    <div className="star-rating">★★★★★</div>
                    <p>(4.8)Reviews</p>
                  </div>
                </div>
                <div className="">
                  Be Part of a Thriving Community of 100+ Riders Growing Their
                  Skills Daily
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    <section className="bg-1 pdtb2">
      <div className="contains1 pdtb">
        <div className="contains-wrapper">
          <div className="flex">
            <div
              className="left"
              style={{ display: "flex", flexDirection: "row" }}
            >
              <div style={{ width: "65%" }}>
                <div style={{ padding: 20 }}>
                  <div className="cover1">
                    <div className="splash">
                      <img
                        className="myImage htt"
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/about-us-img-1.jpg"
                        alt=""
                        width="100%"
                        style={{ borderRadius: 20 }}
                      />
                      <div className="diagonal-overlay" />
                    </div>
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  width: "35%"
                }}
              >
                <div className="circular-video-button cbxt">
                  <svg viewBox="0 0 160 160">
                    <g className="rotating-group">
                      {/* Outer circle */}
                      <circle cx={80} cy={80} r={75} fill="#FF5722" />
                      {/* Circular path for text */}
                      <defs>
                        <path
                          id="circlePath"
                          d="M 80,25 A 55 55 0 1 1 79.99 25"
                        />
                      </defs>
                      {/* Three evenly spaced texts */}
                      <text>
                        <textPath href="#circlePath" startOffset="0%">
                          . Contact Us .
                        </textPath>
                      </text>
                      <text>
                        <textPath href="#circlePath" startOffset="33.33%">
                          . Contact Us .
                        </textPath>
                      </text>
                      <text>
                        <textPath href="#circlePath" startOffset="66.66%">
                          . Contact Us .
                        </textPath>
                      </text>
                      {/* Center image fully centered */}
                      <foreignObject x={0} y={0} width="100%" height="100%">
                        <div
                          xmlns="http://www.w3.org/1999/xhtml"
                          className="play-icon-container"
                        >
                          <img
                            src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/horse-circle-img.png"
                            alt=""
                          />
                        </div>
                      </foreignObject>
                    </g>
                  </svg>
                </div>
                <div className="cover1 xt2">
                  <div className="splash">
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/about-us-img-2.jpg"
                      alt=""
                      style={{ borderRadius: 20 }}
                      className="ig1 myImage"
                    />
                    <div className="diagonal-overlay" />
                  </div>
                </div>
                <div className="cover1">
                  <div className="splash">
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/about-us-img-3.jpg"
                      alt=""
                      style={{ borderRadius: 20 }}
                      className="ig2 myImage"
                    />
                    <div className="diagonal-overlay" />
                  </div>
                </div>
              </div>
            </div>
            <div className="right left-right lrtz ">
              <div
                className="btn1"
                style={{ width: 200 }}
                data-aos="fade-up"
                data-aos-delay={500}
                data-aos-duration={500}
              >
                <p className="f14 clr1">
                  {" "}
                  <span className="dot" />
                  Tradition. Trust. Together.
                </p>
              </div>
              <h1 className="f46 typing-container">
                Nurturing the bond between horse and rider{" "}
                <span className="fontz"> through passion, patience</span>
              </h1>
              <p
                className="gy mt20"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={800}
              >
                Our horse club was founded on the belief that riding should be
                accessible, enjoyable, &amp; empowering. With a supportive
                environment, expert trainers, and a herd of accessible
                well-cared-for horses, we help every rider create their own
                unforgettable journey.
              </p>
              <div
                className="line3 mt50"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              />
              <div
                className="rc mt50"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div className="rc1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                    fill="currentColor"
                    className="zb"
                  >
                    <path d="M37.5723 9.99902C37.5722 5.8175 34.1825 2.42773 30.001 2.42773H10.001C5.8195 2.42781 2.42976 5.81755 2.42969 9.99902V29.999C2.42969 34.1806 5.81946 37.5702 10.001 37.5703H30.001C34.1826 37.5703 37.5723 34.1806 37.5723 29.999V9.99902ZM39.5723 29.999C39.5723 35.2852 35.2871 39.5703 30.001 39.5703H10.001C4.71489 39.5702 0.429688 35.2851 0.429688 29.999V9.99902C0.429763 4.71298 4.71493 0.42781 10.001 0.427734H30.001C35.2871 0.427734 39.5722 4.71293 39.5723 9.99902V29.999Z"></path>
                    <path d="M17.2803 11.894C17.6775 11.9485 18.0039 12.2357 18.1094 12.6225L21.8174 26.2202L26.3135 19.5005L26.3887 19.4018C26.5772 19.1841 26.8525 19.0571 27.1445 19.0571H32.8584C33.4107 19.0571 33.8584 19.5048 33.8584 20.0571C33.8582 20.6092 33.4105 21.0571 32.8584 21.0571H27.6787L22.2617 29.1557C22.044 29.4812 21.656 29.6493 21.2695 29.5864C20.883 29.5234 20.5689 29.2405 20.4658 28.8628L16.7969 15.4135L13.7168 20.5698C13.5362 20.8717 13.2102 21.0571 12.8584 21.0571H7.14453C6.5924 21.0571 6.14477 20.6092 6.14453 20.0571C6.14453 19.5048 6.59225 19.0571 7.14453 19.0571H12.291L16.2861 12.3725C16.4918 12.0284 16.8831 11.8396 17.2803 11.894Z"></path>
                  </svg>
                  <div>
                    <p className="f20"> Friendly Atmosphere </p>
                    <p className="gy mt20">
                      A place where every rider feels welcome, supported.
                    </p>
                  </div>
                </div>
                <div className="rc1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 40 40"
                    fill="currentColor"
                    className="zb"
                  >
                    <path d="M37.5078 10.6855C37.5077 10.5746 37.4771 10.4656 37.4189 10.3711C37.3618 10.2784 37.2803 10.2033 37.1836 10.1533L20.9443 2.63184L20.7168 2.54688C20.4854 2.47352 20.2437 2.43555 20 2.43555C19.6776 2.43558 19.3586 2.50143 19.0625 2.62891L2.81543 10.2109C2.71918 10.261 2.63798 10.3362 2.58105 10.4287C2.52291 10.5232 2.49219 10.6322 2.49219 10.7432C2.4922 10.8542 2.52288 10.9631 2.58105 11.0576C2.63928 11.1522 2.7231 11.2283 2.82227 11.2783H2.82129L19.0557 18.7969L19.2832 18.8828C19.5145 18.9562 19.7563 18.9931 20 18.9932C20.3249 18.9932 20.6463 18.9263 20.9443 18.7969L37.1855 11.2168C37.2812 11.1668 37.3622 11.0929 37.4189 11.001C37.4772 10.9064 37.5078 10.7966 37.5078 10.6855ZM39.5078 10.6855C39.5078 11.1669 39.3744 11.639 39.1221 12.0488C38.8697 12.4587 38.5088 12.7911 38.0791 13.0078C38.0701 13.0123 38.0609 13.0163 38.0518 13.0205L21.7656 20.6211C21.7576 20.6248 21.7493 20.6283 21.7412 20.6318C21.1918 20.8704 20.599 20.9932 20 20.9932C19.401 20.9931 18.8082 20.8704 18.2588 20.6318C18.2516 20.6287 18.2444 20.6254 18.2373 20.6221L1.95117 13.0791C1.94112 13.0744 1.93079 13.0694 1.9209 13.0645C1.49137 12.8477 1.13018 12.5161 0.87793 12.1064C0.625621 11.6966 0.492201 11.2244 0.492188 10.7432C0.492187 10.2619 0.625609 9.78975 0.87793 9.37988C1.13017 8.97017 1.49136 8.63862 1.9209 8.42188L1.94922 8.4082L18.2344 0.808594C18.2425 0.804806 18.2506 0.800444 18.2588 0.796875C18.8082 0.558302 19.401 0.435576 20 0.435547C20.5241 0.435547 21.0435 0.529544 21.5332 0.712891L21.7412 0.796875L21.7637 0.806641L38.0488 8.34961C38.0589 8.35427 38.0692 8.35927 38.0791 8.36426C38.5088 8.58101 38.8697 8.91338 39.1221 9.32324C39.3743 9.73296 39.5077 10.2044 39.5078 10.6855Z"></path>
                    <path d="M38.1543 20.0919C38.6559 19.8609 39.2494 20.0805 39.4805 20.5821C39.7113 21.0836 39.4926 21.6772 38.9912 21.9083L21.5625 29.9366L21.5586 29.9386C21.0562 30.1677 20.5102 30.2862 19.958 30.2862C19.4058 30.2862 18.8598 30.1677 18.3574 29.9386L18.3525 29.9366L1.00975 21.9073C0.50858 21.6753 0.290468 21.0813 0.522444 20.5802C0.754451 20.079 1.34842 19.8609 1.84959 20.0929L19.1914 28.1202C19.4322 28.2294 19.6935 28.2862 19.958 28.2862C20.2227 28.2862 20.4845 28.2296 20.7256 28.1202L38.1543 20.0919Z"></path>
                    <path d="M38.1543 29.377C38.6559 29.146 39.2494 29.3657 39.4805 29.8673C39.7113 30.3688 39.4926 30.9623 38.9912 31.1934L21.5625 39.2218L21.5586 39.2237C21.0562 39.4528 20.5102 39.5714 19.958 39.5714C19.4058 39.5713 18.8598 39.4529 18.3574 39.2237L18.3525 39.2218L1.00975 31.1925C0.50858 30.9605 0.290468 30.3665 0.522444 29.8653C0.754451 29.3641 1.34842 29.146 1.84959 29.378L19.1914 37.4054C19.4322 37.5146 19.6935 37.5713 19.958 37.5714C20.2227 37.5714 20.4845 37.5147 20.7256 37.4054L38.1543 29.377Z"></path>
                  </svg>
                  <div>
                    <p className="f20"> Trusted Horses </p>
                    <p className="gy mt20">
                      Professional guidance with well-trained, gentle horses.
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="ripple-btn mt20 no-dot "
                data-text="More About Us"
                data-aos="fade-up"
                data-aos-delay={1200}
                data-aos-duration={500}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="service radus ">
      <div>
        <div className="contains1">
          <div className="contains-wrapper w80">
            <div className="flex left-right">
              <div className="left">
                <div
                  className="btn1"
                  style={{ width: 270 }}
                  data-aos="fade-up"
                  data-aos-delay={1000}
                  data-aos-duration={500}
                >
                  <p className="f14 clr1">
                    {" "}
                    <span className="dot" />
                    Your Equestrian Journey Starts Here
                  </p>
                </div>
                <h1 className="f46 typing-container">
                  Helping you connect, learn, and{" "}
                  <span className="fontz">grow through ride</span>
                </h1>
              </div>
              <div
                className="right rt mt100"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <button
                  className="ripple-btn m20 no-dot "
                  data-text="View All Service"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="contains mt50">
          <div className="blog-3">
            <div
              className=" item3x ml"
              data-aos="fade-up"
              data-aos-delay={1000}
              data-aos-duration={800}
            >
              <p className="f20 gy">01</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <p className="f20">Horse Riding Lessons</p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="currentColor"
                  >
                    <path d="M37.8203 8.57129C37.8202 7.86915 37.4532 7.1157 36.6064 6.3457C35.7594 5.57555 34.4919 4.84752 32.8623 4.2207C29.6074 2.9688 25.0594 2.17871 19.999 2.17871C14.9389 2.17873 10.3916 2.96889 7.13672 4.2207C5.50683 4.84758 4.2387 5.57545 3.3916 6.3457C2.54483 7.1157 2.17783 7.86915 2.17773 8.57129C2.17773 9.27346 2.54481 10.0268 3.3916 10.7969C4.2387 11.5672 5.50675 12.295 7.13672 12.9219C10.3916 14.1737 14.9388 14.9648 19.999 14.9648C25.0594 14.9648 29.6074 14.1738 32.8623 12.9219C34.492 12.295 35.7594 11.5671 36.6064 10.7969C37.4533 10.0268 37.8203 9.27349 37.8203 8.57129ZM39.3203 8.57129C39.3203 9.8415 38.6488 10.9682 37.6162 11.9072C36.5838 12.846 35.1312 13.6566 33.4004 14.3223C29.9338 15.6556 25.1954 16.4648 19.999 16.4648C14.8027 16.4648 10.0642 15.6556 6.59766 14.3223C4.86717 13.6567 3.41517 12.8459 2.38281 11.9072C1.35016 10.9682 0.677734 9.84151 0.677734 8.57129C0.677834 7.30117 1.35024 6.17528 2.38281 5.23633C3.41522 4.29757 4.86697 3.48597 6.59766 2.82031C10.0642 1.48702 14.8027 0.67873 19.999 0.678711C25.1953 0.678711 29.9338 1.48704 33.4004 2.82031C35.1312 3.486 36.5838 4.2975 37.6162 5.23633C38.6486 6.17524 39.3202 7.30127 39.3203 8.57129Z"></path>
                    <path d="M0.677734 31.4287V8.57129C0.677734 8.15708 1.01352 7.82129 1.42773 7.82129C1.84195 7.82129 2.17773 8.15708 2.17773 8.57129V31.4287C2.17784 32.1303 2.5448 32.8833 3.3916 33.6533C4.23869 34.4235 5.50684 35.1513 7.13672 35.7783C10.3916 37.0304 14.9387 37.8213 19.999 37.8213C25.0595 37.8213 29.6074 37.0305 32.8623 35.7783C34.4919 35.1514 35.7594 34.4234 36.6064 33.6533C37.4532 32.8833 37.8202 32.1303 37.8203 31.4287V8.57129C37.8203 8.15717 38.1562 7.82145 38.5703 7.82129C38.9845 7.82129 39.3203 8.15708 39.3203 8.57129V31.4287C39.3202 32.6983 38.6485 33.824 37.6162 34.7627C36.5838 35.7014 35.1312 36.5129 33.4004 37.1787C29.9339 38.5122 25.1955 39.3213 19.999 39.3213C14.8025 39.3213 10.0642 38.5123 6.59766 37.1787C4.86694 36.5129 3.41518 35.7014 2.38281 34.7627C1.35034 33.8239 0.677837 32.6984 0.677734 31.4287Z"></path>
                    <path d="M0.677734 20C0.677734 19.5858 1.01352 19.25 1.42773 19.25C1.84195 19.25 2.17773 19.5858 2.17773 20C2.17773 20.7016 2.5447 21.4545 3.3916 22.2246C4.23869 22.9948 5.50677 23.7226 7.13672 24.3496C10.3916 25.6017 14.9387 26.3926 19.999 26.3926C25.0595 26.3926 29.6074 25.6018 32.8623 24.3496C34.492 23.7226 35.7594 22.9947 36.6064 22.2246C37.4534 21.4545 37.8203 20.7016 37.8203 20C37.8203 19.5859 38.1562 19.2502 38.5703 19.25C38.9845 19.25 39.3203 19.5858 39.3203 20C39.3203 21.2696 38.6485 22.3952 37.6162 23.334C36.5838 24.2727 35.1312 25.0842 33.4004 25.75C29.9339 27.0835 25.1955 27.8926 19.999 27.8926C14.8025 27.8926 10.0642 27.0836 6.59766 25.75C4.86693 25.0842 3.41517 24.2727 2.38281 23.334C1.3503 22.3951 0.677734 21.2698 0.677734 20Z"></path>
                  </svg>
                </div>
              </div>
              <p className="gy">
                Master the fundamentals or refine your technique with expert.
              </p>
              <div className="cover1">
                <div className="splash">
                  <img
                    src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/service-1.jpg"
                    alt=""
                    width="100%"
                  />
                  <div className="diagonal-overlay" />
                </div>
              </div>
            </div>
            <div
              className=" item3x ml"
              data-aos="fade-up"
              data-aos-delay={1000}
              data-aos-duration={1000}
            >
              <p className="f20 gy">02</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <p className="f20">Horse Riding Lessons</p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="currentColor"
                  >
                    <path d="M37.8203 20C37.8202 10.1576 29.8415 2.17871 19.999 2.17871C10.1566 2.17881 2.1778 10.1576 2.17773 20C2.17773 29.8424 10.1566 37.8212 19.999 37.8213C29.8415 37.8213 37.8203 29.8425 37.8203 20ZM39.3203 20C39.3203 30.6709 30.6699 39.3213 19.999 39.3213C9.32815 39.3212 0.677734 30.6709 0.677734 20C0.677799 9.3292 9.32819 0.678809 19.999 0.678711C30.6699 0.678711 39.3202 9.32914 39.3203 20Z"></path>
                    <path d="M38.5703 19.25L38.6475 19.2539C39.0256 19.2924 39.3203 19.6117 39.3203 20C39.3203 20.3883 39.0256 20.7076 38.6475 20.7461L38.5703 20.75H1.42773C1.01352 20.75 0.677734 20.4142 0.677734 20C0.677734 19.5858 1.01352 19.25 1.42773 19.25H38.5703Z"></path>
                    <path d="M19.9981 0.678711C20.2237 0.678711 20.4377 0.780128 20.5801 0.955078C24.9709 6.35455 27.5314 13.0108 27.8906 19.9609C27.892 19.9867 27.892 20.0133 27.8906 20.0391C27.5315 26.9893 24.9709 33.6454 20.5801 39.0449C20.4377 39.22 20.2237 39.3213 19.9981 39.3213C19.7724 39.3212 19.5584 39.22 19.416 39.0449C15.0252 33.6455 12.4655 26.9892 12.1065 20.0391C12.1051 20.0134 12.1051 19.9875 12.1065 19.9619C12.4655 13.0116 15.0251 6.35467 19.416 0.955078L19.4727 0.893555C19.612 0.756641 19.8005 0.678769 19.9981 0.678711ZM19.9981 2.64258C16.1725 7.64728 13.9399 13.6955 13.6065 20C13.9399 26.3043 16.1728 32.3519 19.9981 37.3564C23.8234 32.3518 26.0561 26.3044 26.3897 20C26.0561 13.6954 23.8237 7.64731 19.9981 2.64258Z"></path>
                  </svg>
                </div>
              </div>
              <p className="gy">
                Master the fundamentals or refine your technique with expert.
              </p>
              <div className="cover1">
                <div className="splash">
                  <img
                    src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/service-2.jpg"
                    alt=""
                    width="100%"
                  />
                  <div className="diagonal-overlay" />
                </div>
              </div>
            </div>
            <div
              className=" item3x ml"
              data-aos="fade-up"
              data-aos-delay={1000}
              data-aos-duration={1200}
            >
              <p className="f20 gy">03</p>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between"
                }}
              >
                <p className="f20">Horse Riding Lessons</p>
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="currentColor"
                  >
                    <path d="M19.25 31.5146V28.6289C19.25 28.2147 19.5858 27.8789 20 27.8789C20.4142 27.8789 20.75 28.2147 20.75 28.6289V31.5146C20.75 31.9289 20.4142 32.2646 20 32.2646C19.5858 32.2646 19.25 31.9289 19.25 31.5146Z"></path>
                    <path d="M19.25 17V14.3145C19.25 13.9002 19.5858 13.5645 20 13.5645C20.4142 13.5645 20.75 13.9002 20.75 14.3145V17C20.75 17.4142 20.4142 17.75 20 17.75C19.5858 17.75 19.25 17.4142 19.25 17Z"></path>
                    <path d="M36.3936 27.1143C36.3936 22.9628 35.3584 19.5474 33.3164 16.6543C31.2669 13.7509 28.1653 11.3214 23.9502 9.21387C23.7494 9.11341 23.6044 8.9279 23.5547 8.70898C23.5049 8.49008 23.5558 8.26037 23.6934 8.08301L27.0264 3.79004C27.121 3.62401 27.1738 3.43748 27.1768 3.24609C27.1798 3.04585 27.1299 2.84834 27.0322 2.67383C26.9345 2.49933 26.7924 2.35299 26.6201 2.25098C26.4909 2.17448 26.3479 2.12439 26.2002 2.10352L26.0508 2.09277H13.9492L13.8008 2.10352C13.653 2.12435 13.5102 2.17445 13.3809 2.25098C13.2086 2.35293 13.0667 2.49901 12.9688 2.67383C12.871 2.84857 12.8202 3.04598 12.8232 3.24609C12.8263 3.4386 12.88 3.62626 12.9756 3.79297L16.3086 8.11328C16.4452 8.29036 16.4957 8.51925 16.4463 8.7373C16.3966 8.95554 16.2517 9.14059 16.0518 9.24121C11.836 11.3631 8.73442 13.7997 6.68457 16.707C4.64213 19.6039 3.6075 23.0195 3.60742 27.1709C3.60742 30.8099 5.2452 33.4177 8.07129 35.1533C10.9415 36.916 15.07 37.7929 20 37.793C24.9301 37.793 29.058 36.9164 31.9277 35.1475C34.753 33.4058 36.3936 30.7841 36.3936 27.1143ZM37.8936 27.1143C37.8936 31.3301 35.961 34.4227 32.7148 36.4238C29.5132 38.3975 25.0696 39.293 20 39.293C14.9303 39.2929 10.4872 38.3975 7.28613 36.4316C4.04108 34.4387 2.10742 31.3603 2.10742 27.1709C2.1075 22.7512 3.21585 19.0243 5.45898 15.8428C7.55502 12.8699 10.6099 10.4186 14.5723 8.31738L11.749 4.6582C11.7313 4.63525 11.7151 4.61079 11.7002 4.58594C11.4611 4.18789 11.3316 3.73379 11.3242 3.26953V3.26855C11.3172 2.80401 11.4323 2.34568 11.6592 1.94043H11.6602C11.8872 1.53523 12.2173 1.19663 12.6172 0.959961C13.0169 0.723462 13.4721 0.596791 13.9365 0.592773H26.0635L26.2373 0.599609C26.6413 0.629747 27.0338 0.752845 27.3838 0.959961C27.7835 1.19657 28.1138 1.53497 28.3408 1.94043C28.568 2.34591 28.6838 2.80415 28.6768 3.26855C28.6696 3.73315 28.5392 4.18768 28.2998 4.58594C28.2845 4.61141 28.2682 4.63668 28.25 4.66016L25.4326 8.28906C29.3926 10.377 32.4467 12.8207 34.542 15.7891C36.7853 18.9673 37.8936 22.6946 37.8936 27.1143Z"></path>
                    <path d="M17.2333 17.3029C18.006 16.6536 18.9988 16.3297 20.0048 16.3937C20.6296 16.3628 21.2538 16.465 21.8349 16.6974C22.4319 16.9362 22.9685 17.3046 23.4061 17.7755C23.6881 18.079 23.6705 18.5541 23.3671 18.8361C23.0637 19.1176 22.5894 19.1001 22.3075 18.797C22.0208 18.4884 21.6693 18.2464 21.2782 18.09C20.8872 17.9336 20.466 17.8661 20.0458 17.8917C20.0115 17.8938 19.9766 17.8934 19.9423 17.8908C19.3102 17.8421 18.6836 18.0434 18.1981 18.4513C17.733 18.8423 17.4342 19.3935 17.3563 19.9943C17.4381 20.5966 17.7391 21.1488 18.2059 21.5411C18.6911 21.9487 19.3157 22.1525 19.9481 22.1095C20.968 22.04 21.976 22.3686 22.7587 23.0265C23.5411 23.6841 24.0382 24.6194 24.1454 25.6359C24.1509 25.688 24.1509 25.7409 24.1454 25.7931C24.0383 26.8097 23.5413 27.7457 22.7587 28.4034C21.9854 29.0533 20.9926 29.3807 19.9852 29.3214C19.4273 29.3388 18.8722 29.2486 18.3505 29.0538L18.1229 28.9611C17.5231 28.697 16.9916 28.2993 16.5692 27.798C16.3024 27.4812 16.3424 27.0082 16.6591 26.7413C16.9757 26.4746 17.4488 26.5147 17.7157 26.8312C17.9903 27.1571 18.3363 27.4161 18.7265 27.588H18.7274C19.1179 27.7598 19.5426 27.8402 19.9686 27.8224L20.0507 27.8234C20.6832 27.8664 21.3076 27.6627 21.7929 27.255C22.2582 26.8639 22.5577 26.3141 22.6405 25.714C22.5574 25.1144 22.2578 24.5656 21.7929 24.1749C21.3076 23.767 20.6833 23.5625 20.0507 23.6056C19.0308 23.6751 18.0237 23.3463 17.2411 22.6886C16.4585 22.0309 15.9606 21.0959 15.8534 20.0792C15.8481 20.0291 15.8486 19.978 15.8534 19.9279C15.9523 18.906 16.4474 17.9634 17.2333 17.3029Z"></path>
                  </svg>
                </div>
              </div>
              <p className="gy">
                Master the fundamentals or refine your technique with expert.
              </p>
              <div className="cover1">
                <div className="splash">
                  <img
                    src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/service-3-1024x684.jpg"
                    alt=""
                    width="100%"
                  />
                  <div className="diagonal-overlay" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className="contains1"
          data-aos="fade-up"
          data-aos-delay={1000}
          data-aos-duration={500}
        >
          <div
            className="contains-wrapper"
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center"
            }}
          >
            <div className="line3 mt20" style={{ marginTop: 50 }} />
            <p className="f16 mt20">
              <span className="btny">Free</span>
              Feel the freedom, live the moment –{" "}
              <a href="" style={{ color: "crimson", fontWeight: "bold" }}>
                join the excitement today!
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
    <section className="club pdtb pdtb2">
      <div className="flex flex-cont">
        <div className="left left-right jtk">
          <div>
            <div
              className="btn1"
              style={{ width: 160 }}
              data-aos="fade-up"
              data-aos-delay={1000}
              data-aos-duration={500}
            >
              <p className="f14 clr1">
                {" "}
                <span className="dot" />
                Our Club Benefits
              </p>
            </div>
            <h1 className="f46 typing-container">
              Exceptional benefits that set our{" "}
              <span className="fontz">horse club apart</span>
            </h1>
          </div>
          <div
            className="accordion mt50"
            id="accordionExample"
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            {/* First Item: Arrow alone */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button f22"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseOne"
                  aria-expanded="false"
                  aria-controls="collapseOne"
                >
                  Personalized Rider Development
                  <span className="arrow-circle">
                    <i className="fa-solid fa-arrow-right" />
                  </span>
                </button>
              </h2>
              <div
                id="collapseOne"
                className="accordion-collapse collapse"
                aria-labelledby="headingOne"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body ">
                  <p className="f16 gy">
                    Each rider receives individual attention to grow their
                    confidence, refine their technique, and reach their full
                    potential.
                  </p>
                </div>
              </div>
            </div>
            {/* Second Item: Arrow inside circle */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingTwo">
                <button
                  className="accordion-button collapsed f22"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseTwo"
                  aria-expanded="false"
                  aria-controls="collapseTwo"
                >
                  Well-Trained &amp; Gentle Horses
                  <span className="arrow-circle">
                    <i className="fa-solid fa-arrow-right" />
                  </span>
                </button>
              </h2>
              <div
                id="collapseTwo"
                className="accordion-collapse collapse"
                aria-labelledby="headingTwo"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p className="f16 gy">
                    We track key performance indicators(KPIs) such as website,
                    conversion, click-through rates (CTR), ROI.
                  </p>
                </div>
              </div>
            </div>
            {/* Third Item: Arrow alone */}
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingThree">
                <button
                  className="accordion-button collapsed f22"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseThree"
                  aria-expanded="false"
                  aria-controls="collapseThree"
                >
                  Peaceful Countryside Setting
                  <span className="arrow-circle">
                    <i className="fa-solid fa-arrow-right" />
                  </span>
                </button>
              </h2>
              <div
                id="collapseThree"
                className="accordion-collapse collapse"
                aria-labelledby="headingThree"
                data-bs-parent="#accordionExample"
              >
                <div className="accordion-body">
                  <p className="f16 gy">
                    We track key performance indicators(KPIs) such as website,
                    conversion, click-through rates (CTR), ROI.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <button
            className="ripple-btn m20 no-dot"
            data-text="Contact Us Today"
          />
        </div>
        <div className="right" style={{ position: "relative" }}>
          <p
            className="gy d-none d-md-block "
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            Enjoy hands-on training, gentle horses, and an environment designed
            to help you relax, grow, and fall in love with riding – whether it’s
            your first time or your fiftieth.
          </p>
          <div className=" mt50">
            <div className="flex-img1">
              <div className="cover1">
                <div className="splash">
                  <img
                    src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/benefits-image-1.jpg"
                    alt=""
                    className="img-r club-img myImage"
                    width="100%"
                  />
                  <div className="diagonal-overlay" />
                </div>
              </div>
              <div className="cover1">
                <div className="splash" style={{ height: 420, marginTop: 50 }}>
                  <img
                    src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/benefits-image-2.jpg"
                    alt=""
                    className="img-r club-img cg2 mdn myImage"
                    width="100%"
                    height="420px"
                  />
                  <div className="diagonal-overlay" />
                </div>
              </div>
            </div>
            <div className="circular-video-button cdrt">
              <svg viewBox="0 0 160 160">
                <g className="rotating-group">
                  {/* Outer circle */}
                  <circle cx={80} cy={80} r={75} fill="#FF5722" />
                  {/* Circular path for text */}
                  <defs>
                    <path id="circlePath" d="M 80,25 A 55 55 0 1 1 79.99 25" />
                  </defs>
                  {/* Three evenly spaced texts */}
                  <text>
                    <textPath href="#circlePath" startOffset="0%">
                      . Contact Us .
                    </textPath>
                  </text>
                  <text>
                    <textPath href="#circlePath" startOffset="33.33%">
                      . Contact Us .
                    </textPath>
                  </text>
                  <text>
                    <textPath href="#circlePath" startOffset="66.66%">
                      . Contact Us .
                    </textPath>
                  </text>
                  {/* Center image fully centered */}
                  <foreignObject x={0} y={0} width="100%" height="100%">
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="play-icon-container"
                    >
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/horse-circle-img.png"
                        alt=""
                      />
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
            <div className="bg-orange img-r club-img mt20">
              <div className="flexc">
                <div>
                  <p className="f40">
                    <span className="counter" data-destination={98}>
                      0
                    </span>
                    %
                  </p>
                </div>
                <div>
                  <p className="f16 pr">Events, Shows &amp; Rides Hosted</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="whatwedo  radus pdtb2">
      <div className="flex flex-cont pdtb">
        <div className="left msd" style={{ position: "relative" }}>
          <div style={{ display: "flex", flexDirection: "row" }}>
            <div
              className="cover1 gj2"
              style={{ borderRadius: "200px 200px 200px 200px" }}
            >
              <div className="splash">
                <img
                  src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/what-do-image-1.jpg"
                  alt=""
                  className="imgj j2 sz"
                />
                <div className="diagonal-overlay" />
              </div>
            </div>
            <div className="circular-video-button cdrt1">
              <svg viewBox="0 0 160 160">
                <g className="rotating-group">
                  {/* Outer circle */}
                  <circle
                    cx={80}
                    cy={80}
                    r={75}
                    fill="#FF5722"
                    stroke="darkblue"
                  />
                  {/* Circular path for text */}
                  <defs>
                    <path id="circlePath" d="M 80,25 A 55 55 0 1 1 79.99 25" />
                  </defs>
                  {/* Three evenly spaced texts */}
                  <text>
                    <textPath href="#circlePath" startOffset="0%">
                      . Contact Us .
                    </textPath>
                  </text>
                  <text>
                    <textPath href="#circlePath" startOffset="33.33%">
                      . Contact Us .
                    </textPath>
                  </text>
                  <text>
                    <textPath href="#circlePath" startOffset="66.66%">
                      . Contact Us .
                    </textPath>
                  </text>
                  {/* Center image fully centered */}
                  <foreignObject x={0} y={0} width="100%" height="100%">
                    <div
                      xmlns="http://www.w3.org/1999/xhtml"
                      className="play-icon-container"
                    >
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/horse-circle-img.png"
                        alt=""
                      />
                    </div>
                  </foreignObject>
                </g>
              </svg>
            </div>
            <div
              className="cover1 gj"
              style={{ borderRadius: "200px 200px 200px 200px" }}
            >
              <div className="splash">
                <img
                  src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/what-do-image-2.jpg"
                  alt=""
                  className="imgj j1 sz sz1 "
                />
                <div className="diagonal-overlay" />
              </div>
            </div>
          </div>
        </div>
        <div className="right left-right">
          <div
            className="btn1"
            style={{ width: 130 }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <p className="f14 clr1" style={{ color: "white" }}>
              {" "}
              <span className="dot" />
              What We Do
            </p>
          </div>
          <h1 className="f46 typing-container">
            Inspiring every rider to build trust,{" "}
            <span className="fontz">skill &amp; lifelong passion</span>
          </h1>
          <p
            className="mt20"
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={800}
          >
            Whether you’re saddling up for the first time or preparing for your
            next competition, we offer the tools, training, and encouragement
            you need to ride.
          </p>
          <h6 className="f20">What you'll find here:</h6>
          <div
            style={{ display: "flex", flexDirection: "column" }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={1000}
          >
            <div className="flex1 dc mt20">
              <div className="wdr left2 wt-1 wt-2">
                <div>
                  <div className="btz">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={24}
                      height={24}
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M22.2822 5.25C22.5068 5.25 22.7198 5.35071 22.8622 5.52441C23.0047 5.69818 23.0616 5.92713 23.0175 6.14746L21.3037 14.7188C21.2335 15.0691 20.9256 15.3212 20.5683 15.3213H15.4247C15.0107 15.3211 14.6747 14.9854 14.6747 14.5713C14.6748 14.1573 15.0108 13.8215 15.4247 13.8213H19.9531L21.3671 6.75H2.62592L4.04096 13.8213H8.5683C8.98235 13.8214 9.31824 14.1572 9.3183 14.5713C9.3183 14.9854 8.98239 15.3211 8.5683 15.3213H3.42475C3.06748 15.3211 2.75955 15.0691 2.6894 14.7188L0.975528 6.14746C0.931462 5.92713 0.988348 5.69818 1.1308 5.52441C1.27326 5.35066 1.48619 5.25 1.71088 5.25H22.2822Z"></path>
                      <path d="M11.25 5.99951V0.856934C11.25 0.44272 11.5858 0.106934 12 0.106934C12.4142 0.106934 12.75 0.44272 12.75 0.856934V5.99951C12.75 6.41373 12.4142 6.74951 12 6.74951C11.5858 6.74951 11.25 6.41373 11.25 5.99951Z"></path>
                      <path d="M7.82031 23.1426V11.1426C7.82031 10.7284 8.1561 10.3926 8.57031 10.3926C8.98453 10.3926 9.32031 10.7284 9.32031 11.1426V23.1426C9.32031 23.5568 8.98453 23.8926 8.57031 23.8926C8.1561 23.8926 7.82031 23.5568 7.82031 23.1426Z"></path>
                      <path d="M14.6797 23.1426V11.1426C14.6797 10.7284 15.0155 10.3926 15.4297 10.3926C15.8439 10.3926 16.1797 10.7284 16.1797 11.1426V23.1426C16.1797 23.5568 15.8439 23.8926 15.4297 23.8926C15.0155 23.8926 14.6797 23.5568 14.6797 23.1426Z"></path>
                      <path d="M17.1377 22.3926C17.5517 22.3928 17.8877 22.7285 17.8877 23.1426C17.8877 23.5566 17.5517 23.8923 17.1377 23.8926H6.85156C6.43735 23.8926 6.10156 23.5568 6.10156 23.1426C6.10156 22.7284 6.43735 22.3926 6.85156 22.3926H17.1377Z"></path>
                      <path d="M7.70996 0.106934C8.12411 0.10701 8.45996 0.442767 8.45996 0.856934C8.45996 1.2711 8.12411 1.60686 7.70996 1.60693C6.49387 1.60693 5.81681 2.4778 5.4209 3.66553C5.22882 4.24179 5.13009 4.82876 5.08008 5.27881C5.05528 5.50196 5.04317 5.68763 5.03711 5.81494C5.0341 5.87814 5.03293 5.9268 5.03223 5.9585C5.03188 5.97405 5.03133 5.98568 5.03125 5.99268V6.00049C5.03087 6.41438 4.69523 6.74951 4.28125 6.74951C3.86704 6.74951 3.53125 6.41373 3.53125 5.99951V5.97705C3.53138 5.96455 3.53174 5.94709 3.53223 5.92529C3.5332 5.88173 3.53539 5.8197 3.53906 5.74268C3.5464 5.58883 3.56112 5.37236 3.58984 5.11377C3.64697 4.59959 3.76161 3.90024 3.99805 3.19092C4.45931 1.80725 5.49757 0.106934 7.70996 0.106934Z"></path>
                      <path d="M16.2812 0.106934C18.4937 0.106934 19.5319 1.80724 19.9932 3.19092C20.2296 3.90024 20.3442 4.59959 20.4014 5.11377C20.4301 5.37235 20.4448 5.58883 20.4521 5.74268C20.4558 5.8197 20.458 5.88173 20.459 5.92529C20.4595 5.94709 20.4598 5.96455 20.46 5.97705V5.99951L20.4561 6.07666C20.4176 6.45473 20.0982 6.74946 19.71 6.74951C19.3217 6.74951 19.0024 6.45476 18.9639 6.07666L18.96 5.99951C18.96 5.99826 18.96 5.99569 18.96 5.99268C18.9599 5.98568 18.9593 5.97405 18.959 5.9585C18.9583 5.9268 18.9571 5.87813 18.9541 5.81494C18.948 5.68763 18.9359 5.50196 18.9111 5.27881C18.8611 4.82873 18.7614 4.24184 18.5693 3.66553C18.1734 2.47787 17.4973 1.60693 16.2812 1.60693C15.867 1.60693 15.5312 1.27115 15.5312 0.856934C15.5312 0.44272 15.867 0.106934 16.2812 0.106934Z"></path>
                    </svg>
                  </div>
                  <h3 className="f20 mt20">Youth Riding Camps </h3>
                  <p className="f16">
                    Our camps offer young riders a fun and educational.
                  </p>
                </div>
              </div>
              <div className="wdr right2 wt-1">
                <div>
                  <div className="btz ">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width={22}
                      height={24}
                      viewBox="0 0 22 24"
                      fill="currentColor"
                    >
                      <path d="M11.7014 0.107422L11.887 0.115234C12.3179 0.14901 12.7332 0.29577 13.0911 0.541992C13.4998 0.823246 13.8147 1.22084 13.9934 1.68359L14.634 3.33887L16.679 4.51562L18.4436 4.24707L18.4553 4.24512C18.9395 4.1794 19.4326 4.25969 19.8714 4.47461C20.2553 4.66276 20.5827 4.94734 20.8225 5.29883L20.9202 5.45312L20.9221 5.45703L21.6028 6.64844C21.8554 7.07809 21.9718 7.57441 21.9368 8.07129C21.9017 8.56645 21.7168 9.03886 21.4085 9.42773L21.4094 9.42871L20.3176 10.8203V13.1748L21.4378 14.5635L21.4407 14.5674C21.7511 14.957 21.9358 15.4317 21.971 15.9287C22.0062 16.4257 21.8904 16.9219 21.638 17.3516L21.637 17.3506L20.9563 18.5439L20.9544 18.5479C20.7096 18.9706 20.3441 19.3104 19.9055 19.5254C19.4669 19.7402 18.9743 19.8205 18.4905 19.7549L16.7141 19.4834L14.6692 20.6602L14.0276 22.3174C13.8489 22.7799 13.5346 23.1778 13.1262 23.459C12.7174 23.7401 12.2321 23.8921 11.7356 23.8936H10.2913C9.79498 23.8921 9.3104 23.7403 8.90162 23.459C8.49286 23.1776 8.178 22.7795 7.99928 22.3164L7.35768 20.6602L5.31178 19.4834L3.53737 19.7549C3.0533 19.8205 2.56021 19.7405 2.12135 19.5254C1.68302 19.3105 1.3182 18.9705 1.0735 18.5479L1.07155 18.5439L0.385023 17.3438L0.386 17.3428C0.136874 16.9151 0.0209497 16.4227 0.0559215 15.9287C0.0911252 15.4317 0.276659 14.9571 0.587171 14.5674L1.67506 13.1807V10.8252L0.555921 9.43652L0.552992 9.43359C0.24238 9.04382 0.0569451 8.56842 0.0217418 8.07129C-0.0133556 7.57428 0.103193 7.07798 0.355726 6.64844L1.03737 5.45703L1.03932 5.45312C1.28405 5.03036 1.64856 4.68958 2.08717 4.47461C2.47115 4.28645 2.8968 4.20168 3.32155 4.22754L3.50319 4.24609L3.51588 4.24707L5.28151 4.51562L7.35963 3.33691L8.00026 1.68359C8.17899 1.22099 8.49315 0.823174 8.90162 0.541992C9.31047 0.260558 9.79501 0.108941 10.2913 0.107422H11.7014ZM10.1516 1.61914C10.0564 1.63385 9.96379 1.66202 9.87721 1.7041L9.75221 1.77734C9.59218 1.88746 9.46958 2.04348 9.39967 2.22461L9.39869 2.22559L8.66139 4.12793C8.59892 4.28919 8.48269 4.4244 8.33229 4.50977L5.79518 5.94922C5.64866 6.03238 5.47832 6.06447 5.31178 6.03906L3.30104 5.73145C3.11174 5.70585 2.91887 5.73724 2.74733 5.82129C2.57573 5.90537 2.43294 6.03877 2.33717 6.2041L1.65358 7.40137L1.64869 7.40918C1.54996 7.57724 1.50407 7.77136 1.51784 7.96582C1.53151 8.15881 1.60314 8.34332 1.72291 8.49512L3.00905 10.0898C3.11647 10.2232 3.17506 10.3893 3.17506 10.5605V13.4404C3.17503 13.6083 3.11856 13.7713 3.01491 13.9033L1.76393 15.498L1.76002 15.502C1.63856 15.6544 1.56676 15.8407 1.55299 16.0352C1.54272 16.181 1.56558 16.3264 1.6194 16.4609L1.68287 16.5918L1.68776 16.5996L2.37135 17.7959C2.46703 17.9612 2.60987 18.0945 2.78151 18.1787C2.95312 18.2628 3.14663 18.2943 3.33619 18.2686L5.34596 17.9619L5.47291 17.9531C5.59882 17.9554 5.72291 17.9893 5.83327 18.0527L8.33619 19.4932L8.44166 19.5654C8.53945 19.6466 8.61495 19.7523 8.66139 19.8721L9.39869 21.7754L9.39967 21.7764C9.4696 21.9573 9.59223 22.1135 9.75221 22.2236L9.87721 22.2959C10.0072 22.3591 10.1504 22.3931 10.2962 22.3936H11.7317C11.9259 22.393 12.1156 22.3337 12.2756 22.2236C12.4356 22.1135 12.5583 21.9574 12.6282 21.7764L12.6292 21.7754L13.3655 19.8721C13.4274 19.7122 13.5431 19.5787 13.6917 19.4932L16.1936 18.0527C16.3409 17.968 16.5129 17.9363 16.6809 17.9619L18.6917 18.2686L18.8342 18.2773C18.9763 18.2755 19.1167 18.2417 19.2454 18.1787C19.4171 18.0945 19.5607 17.9614 19.6565 17.7959L20.3401 16.5996L20.344 16.5918C20.4428 16.4238 20.4886 16.2297 20.4749 16.0352C20.4612 15.8425 20.3895 15.6575 20.2698 15.5059L18.9846 13.9111C18.8771 13.7778 18.8177 13.6117 18.8176 13.4404V10.5605C18.8176 10.3928 18.8743 10.2297 18.9778 10.0977L20.2297 8.50293L20.2327 8.49805C20.3541 8.34559 20.4269 8.16023 20.4407 7.96582L20.4397 7.82031C20.4281 7.67572 20.3839 7.53519 20.3098 7.40918L20.3049 7.40137L19.6194 6.20117C19.5236 6.03766 19.3814 5.90469 19.2112 5.82129C19.0395 5.73729 18.8467 5.70673 18.6575 5.73242L16.6467 6.03906C16.4788 6.06466 16.3067 6.03201 16.1594 5.94727L13.6565 4.50781C13.508 4.42232 13.3932 4.28771 13.3313 4.12793L12.594 2.22559C12.5241 2.04447 12.4014 1.88744 12.2415 1.77734C12.1215 1.69482 11.9847 1.64124 11.8421 1.61914L11.6975 1.60742H10.2962L10.1516 1.61914ZM10.9964 7.82129C11.8228 7.82129 12.6315 8.0672 13.3186 8.52637C14.0055 8.98546 14.5405 9.63798 14.8567 10.4014C15.173 11.1649 15.2562 12.0049 15.095 12.8154C14.9337 13.6259 14.5358 14.3708 13.9514 14.9551C13.3671 15.5395 12.6222 15.9374 11.8118 16.0986C11.0012 16.2598 10.1612 16.1766 9.39772 15.8604C8.63433 15.5442 7.98181 15.0091 7.52272 14.3223C7.06355 13.6351 6.81764 12.8264 6.81764 12C6.81772 10.8919 7.25869 9.82947 8.04225 9.0459C8.82582 8.26234 9.88825 7.82137 10.9964 7.82129ZM8.31764 12C8.31764 12.5298 8.47547 13.0478 8.76979 13.4883C9.06413 13.9288 9.48254 14.2719 9.97194 14.4746C10.4612 14.6772 10.9994 14.7302 11.5188 14.627C12.0383 14.5236 12.5164 14.2691 12.8909 13.8945C13.2655 13.52 13.5199 13.042 13.6233 12.5225C13.7266 12.003 13.6736 11.4649 13.471 10.9756C13.2683 10.4862 12.9251 10.0678 12.4846 9.77344C12.0442 9.47912 11.5261 9.32129 10.9964 9.32129C10.2861 9.32137 9.60506 9.60419 9.1028 10.1064C8.60054 10.6087 8.31772 11.2897 8.31764 12Z"></path>
                    </svg>
                  </div>
                  <h3 className="f20 mt20">Family-Friendly Events </h3>
                  <p className="f16">
                    Join us for exciting days filled with pony rides,
                    interactive.
                  </p>
                </div>
              </div>
            </div>
            <div className="wdr1">
              <div className="rc">
                <div className="btz gt">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="currentColor"
                  >
                    <path d="M16.3916 9.28613C16.3916 5.36105 13.2102 2.17886 9.28516 2.17871C5.35999 2.17871 2.17773 5.36097 2.17773 9.28613C2.17789 13.2112 5.36009 16.3926 9.28516 16.3926C13.2101 16.3924 16.3914 13.2111 16.3916 9.28613ZM17.8916 9.28613C17.8914 14.0395 14.0386 17.8924 9.28516 17.8926C4.53165 17.8926 0.677886 14.0396 0.677734 9.28613C0.677734 4.53254 4.53156 0.678711 9.28516 0.678711C14.0387 0.678858 17.8916 4.53264 17.8916 9.28613Z"></path>
                    <path d="M37.8193 9.28613C37.8193 5.36108 34.6379 2.17888 30.7129 2.17871C26.7877 2.17871 23.6055 5.36096 23.6055 9.28613C23.6056 13.2112 26.7878 16.3926 30.7129 16.3926C34.6378 16.3924 37.8192 13.2111 37.8193 9.28613ZM39.3193 9.28613C39.3192 14.0395 35.4663 17.8924 30.7129 17.8926C25.9594 17.8926 22.1056 14.0396 22.1055 9.28613C22.1055 4.53255 25.9593 0.678711 30.7129 0.678711C35.4664 0.678884 39.3193 4.53264 39.3193 9.28613Z"></path>
                    <path d="M16.3916 30.7148C16.3916 26.7897 13.2102 23.6076 9.28516 23.6074C5.35998 23.6074 2.17773 26.7897 2.17773 30.7148C2.17791 34.6399 5.3601 37.8213 9.28516 37.8213C13.2101 37.8211 16.3914 34.6398 16.3916 30.7148ZM17.8916 30.7148C17.8914 35.4682 14.0386 39.3211 9.28516 39.3213C4.53167 39.3213 0.677909 35.4683 0.677734 30.7148C0.677734 25.9612 4.53157 22.1074 9.28516 22.1074C14.0387 22.1076 17.8916 25.9613 17.8916 30.7148Z"></path>
                    <path d="M37.8193 30.7148C37.8193 26.7898 34.6379 23.6076 30.7129 23.6074C26.7877 23.6074 23.6055 26.7897 23.6055 30.7148C23.6056 34.6399 26.7878 37.8213 30.7129 37.8213C34.6378 37.8211 37.8192 34.6398 37.8193 30.7148ZM39.3193 30.7148C39.3192 35.4682 35.4662 39.3211 30.7129 39.3213C25.9594 39.3213 22.1056 35.4683 22.1055 30.7148C22.1055 25.9612 25.9593 22.1074 30.7129 22.1074C35.4663 22.1076 39.3193 25.9613 39.3193 30.7148Z"></path>
                  </svg>
                </div>
                <div
                  className="mtz"
                  style={{ display: "flex", flexDirection: "column" }}
                >
                  <h3 className="f20 ">
                    Experience Trainers &amp; Instructors{" "}
                  </h3>
                  <p className="f16">
                    Our dedicated team of certified professionals brings decades
                    of combine experience in a wide range of disciplines.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="whychooseus bg-1">
      <div className="flex-cont cont1">
        <div className="alin-c cc">
          <div
            className="btn1"
            style={{ width: 160 }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <p className="f14 clr1">
              {" "}
              <span className="dot" />
              Why Choose Us
            </p>
          </div>
          <h1 className="f46 typing-container">
            Creating lifelong memories in and out{" "}
            <span className="fontz">of the saddle</span>
          </h1>
        </div>
        <div className="wrapper">
          <div className="ite ite2">
            <div className="flexx">
              <div
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div className="m2t">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 48 50"
                    fill="currentColor"
                    className="clr-o"
                  >
                    <path d="M31.9316 14.2856C31.9316 12.8655 30.7804 11.7144 29.3604 11.7144C27.9402 11.7144 26.7891 12.8655 26.7891 14.2856C26.7891 15.7057 27.9402 16.8569 29.3604 16.8569C30.7805 16.8569 31.9316 15.7058 31.9316 14.2856ZM33.9316 14.2856C33.9316 16.8103 31.885 18.8569 29.3604 18.8569C26.8356 18.8569 24.7891 16.8103 24.7891 14.2856C24.7891 11.7609 26.8357 9.71442 29.3604 9.71436C31.885 9.71436 33.9316 11.7609 33.9316 14.2856Z"></path>
                    <path d="M15.8604 33.9287C15.8604 33.4949 15.5089 33.1428 15.0752 33.1426C14.6412 33.1426 14.2891 33.4948 14.2891 33.9287C14.2893 34.3625 14.6414 34.7139 15.0752 34.7139C15.5088 34.7136 15.8601 34.3623 15.8604 33.9287ZM17.8604 33.9287C17.8601 35.4669 16.6133 36.7136 15.0752 36.7139C13.5367 36.7139 12.2893 35.467 12.2891 33.9287C12.2891 32.3903 13.5366 31.1426 15.0752 31.1426C16.6135 31.1428 17.8604 32.3904 17.8604 33.9287Z"></path>
                    <path d="M17.6426 19.6426C17.6425 18.2225 16.4915 17.0713 15.0713 17.0713C13.6513 17.0713 12.5001 18.2226 12.5 19.6426C12.5 21.0627 13.6512 22.2138 15.0713 22.2139C16.4915 22.2139 17.6426 21.0628 17.6426 19.6426ZM19.6426 19.6426C19.6426 22.1674 17.596 24.2139 15.0713 24.2139C12.5467 24.2138 10.5 22.1673 10.5 19.6426C10.5001 17.118 12.5467 15.0713 15.0713 15.0713C17.596 15.0713 19.6425 17.1179 19.6426 19.6426Z"></path>
                    <path d="M14.8437 2.7819C18.9161 1.01718 23.3957 0.405869 27.792 1.01432C32.1881 1.6228 36.3326 3.42782 39.7724 6.23209C43.2119 9.03611 45.8141 12.7319 47.2959 16.9147C47.7333 18.1451 47.8689 19.463 47.6904 20.7565C47.5118 22.0499 47.0249 23.2815 46.2705 24.3473C45.516 25.4131 44.5161 26.2821 43.3554 26.8805C42.1956 27.4784 40.9092 27.7879 39.6045 27.7848L32.9228 27.7858C31.4607 27.7818 30.0453 28.2995 28.9306 29.2458C27.816 30.1921 27.075 31.5053 26.8418 32.9489C26.6086 34.3925 26.8982 35.8725 27.6582 37.1217C28.3708 38.2929 29.4533 39.1898 30.7305 39.6735L31.0244 39.777C31.753 40.0478 32.3988 40.4993 32.9023 41.0866L33.1094 41.3463L33.2969 41.6198C33.6979 42.2544 33.9347 42.9797 33.9892 43.7311C34.1165 44.7338 33.879 45.7491 33.3203 46.5915C32.7621 47.4328 31.9205 48.0449 30.9482 48.318L30.9492 48.319C28.8389 48.9188 26.6549 49.2195 24.4609 49.2135L24.459 49.2145C20.0216 49.2121 15.6702 47.9899 11.8799 45.6823C8.08904 43.3743 5.00526 40.0685 2.9658 36.1266C0.926464 32.1848 0.00947627 27.7582 0.315412 23.3307C0.621379 18.9033 2.1381 14.6449 4.70018 11.0212C7.2624 7.39723 10.7715 4.54662 14.8437 2.7819ZM27.5176 2.99576C23.4845 2.43758 19.3756 2.99891 15.6396 4.61783C11.9038 6.23675 8.68457 8.85093 6.33397 12.1755C3.98343 15.4999 2.59126 19.4066 2.31053 23.4684C2.02986 27.5303 2.87125 31.5914 4.74217 35.2077C6.61319 38.824 9.44219 41.8569 12.9199 43.9743C16.3977 46.0916 20.3904 47.2127 24.4619 47.2145H24.4648C26.4726 47.2201 28.4711 46.9441 30.4023 46.3952L30.4062 46.3942C30.9175 46.2509 31.3606 45.9287 31.6543 45.486C31.9477 45.0434 32.0717 44.5099 32.0049 43.9831C32.002 43.9604 32.0003 43.9375 31.999 43.9147C31.9703 43.4159 31.7968 42.9358 31.5 42.5338C31.2031 42.1319 30.7954 41.826 30.3271 41.652C28.6165 41.0807 27.1462 39.9591 26.1445 38.4665L25.9492 38.1608C24.9419 36.505 24.5583 34.5439 24.8672 32.6305C25.1763 30.717 26.1581 28.9759 27.6357 27.7213C29.1126 26.4674 30.9884 25.7811 32.9258 25.7858H39.6074C40.5925 25.7884 41.564 25.5546 42.4394 25.1032C43.315 24.6518 44.0695 23.9961 44.6387 23.1921C45.2077 22.3881 45.5752 21.4589 45.7099 20.4831L45.749 20.1169C45.8153 19.26 45.7009 18.3969 45.4121 17.5846C44.0528 13.7467 41.6645 10.3556 38.5088 7.78287C35.353 5.21011 31.5508 3.55397 27.5176 2.99576Z"></path>
                  </svg>
                </div>
                <div className="m2t">
                  <h4 className="f20">
                    1. Experienced Trainers &amp; Instructors
                  </h4>
                  <h4 className="f16 gy m2t">
                    Our dedicated team of certified professionals brings decades
                    of combined experience in a wide range of disciplines.
                  </h4>
                </div>
                <div className="mt50" />
                <div className="line3  m2t"></div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={50}
                    height={50}
                    viewBox="0 0 50 50"
                    fill="currentColor"
                    className="clr-o"
                  >
                    <path d="M19.6465 2.57129C20.1987 2.57143 20.6465 3.01909 20.6465 3.57129V21.4287C20.6463 21.9808 20.1985 22.4286 19.6465 22.4287H1.78906C1.23688 22.4287 0.789232 21.9809 0.789062 21.4287V3.57129C0.789062 3.019 1.23678 2.57129 1.78906 2.57129H19.6465ZM2.78906 20.4287H18.6465V4.57129H2.78906V20.4287Z"></path>
                    <path d="M47.3184 47.2144C47.8705 47.2145 48.3184 47.6621 48.3184 48.2144C48.3184 48.7666 47.8705 49.2142 47.3184 49.2144H29.4609C28.9087 49.2144 28.4609 48.7666 28.4609 48.2144C28.4609 47.6621 28.9087 47.2144 29.4609 47.2144H47.3184Z"></path>
                    <path d="M47.3184 29.3569C47.8705 29.3571 48.3184 29.8047 48.3184 30.3569C48.3184 30.9091 47.8705 31.3568 47.3184 31.3569H29.4609C28.9087 31.3569 28.4609 30.9092 28.4609 30.3569C28.4609 29.8046 28.9087 29.3569 29.4609 29.3569H47.3184Z"></path>
                    <path d="M47.3184 38.2856C47.8705 38.2858 48.3184 38.7334 48.3184 39.2856C48.3184 39.8379 47.8705 40.2855 47.3184 40.2856H29.4609C28.9087 40.2856 28.4609 39.8379 28.4609 39.2856C28.4609 38.7334 28.9087 38.2856 29.4609 38.2856H47.3184Z"></path>
                    <path d="M38.3916 0.785645C38.7704 0.785645 39.1168 0.999621 39.2862 1.33838L49.1075 20.981C49.2624 21.2909 49.2457 21.6598 49.0635 21.9546C48.8813 22.2492 48.5593 22.4282 48.2129 22.4282H28.5703C28.2239 22.4282 27.902 22.2492 27.7198 21.9546C27.5376 21.6598 27.5208 21.2909 27.6758 20.981L37.4971 1.33838L37.5684 1.21729C37.7533 0.949319 38.0602 0.785681 38.3916 0.785645ZM30.1885 20.4282H46.5948L38.3916 4.02197L30.1885 20.4282Z"></path>
                    <path d="M18.6465 39.2856C18.6465 34.9069 15.0965 31.357 10.7178 31.3569C6.33895 31.3569 2.78906 34.9068 2.78906 39.2856C2.78912 43.6644 6.33899 47.2144 10.7178 47.2144C15.0965 47.2143 18.6464 43.6644 18.6465 39.2856ZM20.6465 39.2856C20.6464 44.7689 16.2011 49.2143 10.7178 49.2144C5.23441 49.2144 0.789122 44.769 0.789062 39.2856C0.789062 33.8023 5.23437 29.3569 10.7178 29.3569C16.2011 29.357 20.6465 33.8023 20.6465 39.2856Z"></path>
                  </svg>
                </div>
                <div className="m2t">
                  <h4 className="f20">
                    1. Experienced Trainers &amp; Instructors
                  </h4>
                  <h4 className="f16 gy m2t">
                    Our dedicated team of certified professionals brings decades
                    of combined experience in a wide range of disciplines.
                  </h4>
                </div>
                <div className="line3 dispp" />
              </div>
            </div>
          </div>
          <div className="ite ite2">
            <div className="flexx">
              <div
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="currentColor"
                    className="clr-o"
                  >
                    <path d="M37.5723 9.99902C37.5722 5.8175 34.1825 2.42773 30.001 2.42773H10.001C5.8195 2.42781 2.42976 5.81755 2.42969 9.99902V29.999C2.42969 34.1806 5.81946 37.5702 10.001 37.5703H30.001C34.1826 37.5703 37.5723 34.1806 37.5723 29.999V9.99902ZM39.5723 29.999C39.5723 35.2852 35.2871 39.5703 30.001 39.5703H10.001C4.71489 39.5702 0.429688 35.2851 0.429688 29.999V9.99902C0.429763 4.71298 4.71493 0.42781 10.001 0.427734H30.001C35.2871 0.427734 39.5722 4.71293 39.5723 9.99902V29.999Z"></path>
                    <path d="M17.2803 11.894C17.6775 11.9485 18.0039 12.2357 18.1094 12.6225L21.8174 26.2202L26.3135 19.5005L26.3887 19.4018C26.5772 19.1841 26.8525 19.0571 27.1445 19.0571H32.8584C33.4107 19.0571 33.8584 19.5048 33.8584 20.0571C33.8582 20.6092 33.4105 21.0571 32.8584 21.0571H27.6787L22.2617 29.1557C22.044 29.4812 21.656 29.6493 21.2695 29.5864C20.883 29.5234 20.5689 29.2405 20.4658 28.8628L16.7969 15.4135L13.7168 20.5698C13.5362 20.8717 13.2102 21.0571 12.8584 21.0571H7.14453C6.5924 21.0571 6.14477 20.6092 6.14453 20.0571C6.14453 19.5048 6.59225 19.0571 7.14453 19.0571H12.291L16.2861 12.3725C16.4918 12.0284 16.8831 11.8396 17.2803 11.894Z"></path>
                  </svg>
                </div>
                <div className="m2t">
                  <h4 className="f20">3. Welcoming Equestrian Community</h4>
                  <h4 className="f16 gy m2t">
                    Join a vibrant, supportive community of riders who share
                    your passion and celebrate every milestone together.
                  </h4>
                </div>
                <div className="mt50" />
                <div className="line3 mt50 m2t"></div>
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width={40}
                    height={40}
                    viewBox="0 0 40 40"
                    fill="currentColor"
                    className="clr-o"
                  >
                    <path d="M37.8203 20C37.8202 10.1576 29.8415 2.17871 19.999 2.17871C10.1566 2.17881 2.1778 10.1576 2.17773 20C2.17773 29.8424 10.1566 37.8212 19.999 37.8213C29.8415 37.8213 37.8203 29.8425 37.8203 20ZM39.3203 20C39.3203 30.6709 30.6699 39.3213 19.999 39.3213C9.32815 39.3212 0.677734 30.6709 0.677734 20C0.677799 9.3292 9.32819 0.678809 19.999 0.678711C30.6699 0.678711 39.3202 9.32914 39.3203 20Z"></path>
                    <path d="M38.5703 19.25L38.6475 19.2539C39.0256 19.2924 39.3203 19.6117 39.3203 20C39.3203 20.3883 39.0256 20.7076 38.6475 20.7461L38.5703 20.75H1.42773C1.01352 20.75 0.677734 20.4142 0.677734 20C0.677734 19.5858 1.01352 19.25 1.42773 19.25H38.5703Z"></path>
                    <path d="M19.9981 0.678711C20.2237 0.678711 20.4377 0.780128 20.5801 0.955078C24.9709 6.35455 27.5314 13.0108 27.8906 19.9609C27.892 19.9867 27.892 20.0133 27.8906 20.0391C27.5315 26.9893 24.9709 33.6454 20.5801 39.0449C20.4377 39.22 20.2237 39.3213 19.9981 39.3213C19.7724 39.3212 19.5584 39.22 19.416 39.0449C15.0252 33.6455 12.4655 26.9892 12.1065 20.0391C12.1051 20.0134 12.1051 19.9875 12.1065 19.9619C12.4655 13.0116 15.0251 6.35467 19.416 0.955078L19.4727 0.893555C19.612 0.756641 19.8005 0.678769 19.9981 0.678711ZM19.9981 2.64258C16.1725 7.64728 13.9399 13.6955 13.6065 20C13.9399 26.3043 16.1728 32.3519 19.9981 37.3564C23.8234 32.3518 26.0561 26.3044 26.3897 20C26.0561 13.6954 23.8237 7.64731 19.9981 2.64258Z"></path>
                  </svg>
                </div>
                <div className="m2t">
                  <h4 className="f20">4. Diverse Programs for All Ages</h4>
                  <h4 className="f16 gy m2t">
                    From kids' pony rides to advanced dressage, we offer
                    engaging, age-appropriate programs to spark a lifelong love
                    of riding.
                  </h4>
                </div>
              </div>
            </div>
          </div>
          <div className="ite left-right">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/why-choose-image.png"
              alt=""
              className="left-right"
            />
          </div>
        </div>
      </div>
    </section>
    <section className="fact fonty">
      <div className="fact2">
        <div className="alin-c cc">
          <div
            className="btn1"
            style={{ width: 130 }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <p className="f14 clr1">
              {" "}
              <span className="dot" />
              Our Fun Fact
            </p>
          </div>
          <h1
            className="f46"
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={800}
          >
            Dedicated to nurturing the rider-horse partnership
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
              alt=""
              className="img1"
            />
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-2.jpg"
              alt=""
              className="img1"
            />
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-3.jpg"
              alt=""
              className="img1"
            />
            with quality training,{" "}
            <span className="fontz">care and memorable adventures</span>
          </h1>
        </div>
      </div>
      <div className="contains1">
        <div className="contains-wrapper" style={{ marginTop: 70 }}>
          <div className="flex">
            <div
              className="left"
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly"
              }}
            >
              <div className="flex1">
                <h1 className="f60 sp">
                  <span className="counter" data-destination={25}>
                    0
                  </span>
                  +
                </h1>
                <p className="f16 sp1">Years Equestrian Experience</p>
              </div>
              <div className="flex1">
                <h1 className="f60 sp">
                  <span className="counter" data-destination={1}>
                    0
                  </span>
                  K+
                </h1>
                <p className="f16 sp">Events, Shows &amp; Rides Hosted</p>
              </div>
            </div>
            <div
              className="right"
              style={{
                flexDirection: "row",
                display: "flex",
                justifyContent: "space-evenly"
              }}
            >
              <div className="flex1 sd">
                <h1 className="f60 sp">
                  <span className="counter" data-destination={60}>
                    0
                  </span>
                  +
                </h1>
                <p className="f16 sp">Well-Cared For Horses &nbsp;</p>
              </div>
              <div className="flex1 sd">
                <h1 className="f60 sp">
                  <span className="counter" data-destination={2}>
                    0
                  </span>
                  K+
                </h1>
                <p className="f16 sp">Happy Riders Trainers </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="alin-c">
        <div className="line2" />
      </div>
      <div className="slider-container">
        <div className="slider slider1">
          <div className="hy hy1">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-5.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-6.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-1.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-5.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-6.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-1.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-5.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-6.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-1.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-5.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-6.svg"
              className="im4"
            />
          </div>
          <div className="hy">
            <img
              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/company-supports-logo-1.svg"
              className="im4"
            />
          </div>
        </div>
      </div>
    </section>
    <section className="gallery">
      <div className="contains1">
        <div className="contains-wrapper">
          <div className="flex left-right">
            <div className="left">
              <div
                className="btn1"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <p className="f14 clr1">
                  {" "}
                  <span className="dot" />
                  Our Gallery
                </p>
              </div>
              <h1 className="f46 typing-container">
                See the beauty and passion of our horse{" "}
                <span className="fontz">club in action</span>
              </h1>
            </div>
            <div className="right rt mt100">
              <button
                className="ripple-btn  no-dot"
                data-text="View Our Gallery"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={800}
              />
            </div>
          </div>
        </div>
      </div>
      <div>
        <div className="marquee-container mt50">
          <div className="marquee-container">
            <div
              className="marquee"
              style={{ backgroundColor: "rgb(248, 252, 241)" }}
            >
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-1.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-3.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-5.jpg"
                alt=""
                className="l marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-6.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-7.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-8.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-9.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-1.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-3.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-5.jpg"
                alt=""
                className="l marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-6.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-7.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-8.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-9.jpg"
                alt=""
                className="marque-image"
              />
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginTop: 20 }}>
        <div className="marquee-container">
          <div className="marquee-container">
            <div
              className="marquee1"
              style={{ backgroundColor: "rgb(248, 252, 241)" }}
            >
              {/* 1st set (4 images) */}
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-1.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-3.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              {/* duplicate set for seamless scroll */}
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-5.jpg"
                alt=""
                className="l marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-6.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-7.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-8.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-9.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-1.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-3.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-2.jpg"
                alt=""
                className="marque-image"
              />
              {/* duplicate set for seamless scroll */}
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-5.jpg"
                alt=""
                className="l marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-6.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-7.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-8.jpg"
                alt=""
                className="marque-image"
              />
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/gallery-9.jpg"
                alt=""
                className="marque-image"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="pricing-plan radus">
      <div
        className="left-right"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div
          className="btn1"
          data-aos="fade-up"
          data-aos-delay={1000}
          data-aos-duration={500}
        >
          <p className="f14 ">
            {" "}
            <span className="dot" />
            Pricing plan
          </p>{" "}
          <br />
        </div>
        <h1 className="f46 typing-container">
          Every rider's path starts here - choose <br />{" "}
          <span className="fontz">your ride plan</span>
        </h1>
        <p data-aos="fade-up" data-aos-delay={1000} data-aos-duration={800}>
          We offer beginner, intermediate, and advanced riding lessons tailored
          to all ages. Lessons
          <br />
          include English and Western styles, focusing on skill development,
          safety.
        </p>
      </div>
      <div className="contains">
        <div className="blog-3">
          <div
            className="item-3 bg-2 pdn"
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={1000}
          >
            <div className="cardx" style={{ textAlign: "left" }}>
              <div className="btn1">
                <p className="f14 "> Basic plan</p> <br />
              </div>
              <p className="gy">
                Ideal for beginners, this plan includes 4 riding lessons per
                monthly
              </p>
              <p>
                <span className="f36">$ 29.00</span> /Monthly
              </p>
              <button className="btnz1 fancy-btn">
                <span>Get Started Now</span>
              </button>
              <div className="line3 mt20" />
              <p>
                <span className="check-icon mt20" /> Use of Riding Equipment
              </p>
              <p>
                <span className="check-icon" /> Use of Riding Equipment
              </p>
            </div>
          </div>
          <div
            className="item-3 bg-2 pdn"
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={1200}
          >
            <div className="cardx " style={{ textAlign: "left" }}>
              <div className="btn1">
                <p className="f14 "> Standard plan</p> <br />
              </div>
              <p className="gy">
                Ideal for beginners, this plan includes 4 riding lessons per
                monthly
              </p>
              <p>
                <span className="f36">$ 29.00</span> /Monthly
              </p>
              <button className="btnz1 fancy-btn">
                <span>Get Started Now</span>
              </button>
              <div className="line3 mt20" />
              <p>
                <span className="check-icon mt20" /> Use of Riding Equipment
              </p>
              <p>
                <span className="check-icon" /> Use of Riding Equipment
              </p>
            </div>
          </div>
          <div
            className="item-3 bg-2 pdn"
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={1500}
          >
            <div className="cardx" style={{ textAlign: "left" }}>
              <div className="btn1" style={{ width: 120 }}>
                <p className="f14 "> Premium plan</p> <br />
              </div>
              <p className="gy">
                Ideal for beginners, this plan includes 4 riding lessons per
                monthly
              </p>
              <p>
                <span className="f36">$ 29.00</span> /Monthly
              </p>
              <button className="btnz1 fancy-btn">
                <span>Get Started Now</span>
              </button>
              <div className="line3 mt20" />
              <p>
                <span className="check-icon mt20" />
                Use of Riding Equipment
              </p>
              <p>
                <span className="check-icon" /> Use of Riding Equipment
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="Confidence bg-1 pdtb2">
      <div className="contains1 pdtb">
        <div className="contains-wrapper">
          <div className="flex">
            <div className="left left-right">
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="cover1">
                  <div className="splash">
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/features-image-1.jpg"
                      alt=""
                      className="img6 img61 myImage"
                    />
                    <div className="diagonal-overlay" />
                  </div>
                </div>
                <div className="cover1 img63">
                  <div className="splash">
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/features-image-2.jpg"
                      alt=""
                      className="img6 myImage"
                    />
                    <div className="diagonal-overlay" />
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <div className="group">
                  <p className="f46 mz mt20">
                    <span className="counter" data-destination={25}>
                      0
                    </span>
                    +
                  </p>
                  <p className="f16">Years Equestrian Experience</p>
                </div>
                <div className="cardxc minus">
                  <div className="cover1">
                    <div
                      className="splash"
                      style={{ borderRadius: 20, overflow: "hidden" }}
                    >
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/features-image-3.jpg"
                        alt=""
                        className="img6 img62"
                      />
                      <div className="diagonal-overlay" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="right mrr left-right pt-s">
              <div>
                <div
                  className="btn1"
                  style={{ width: 240 }}
                  data-aos="fade-up"
                  data-aos-delay={1000}
                  data-aos-duration={500}
                >
                  <p className="f14 clr1 ">
                    {" "}
                    <span className="dot" />
                    Plan Your Ride with Confidence
                  </p>
                  <br />
                </div>
                <h1 className="f46 typing-container">
                  A rider's journey: learn, grow &amp;
                  <span className="fontz">ride with purpose</span>
                </h1>
                <p
                  className="gy mtop"
                  data-aos="fade-up"
                  data-aos-delay={1000}
                  data-aos-duration={800}
                >
                  We’ve designed a simple yet effective process that nurtures
                  your skills, ensures safety, and deepens your passion for
                  riding with every session.
                </p>
              </div>
              <div
                style={{ display: "flex", flexDirection: "row" }}
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div className="rc">
                  <div className="sps1">
                    <p className="f20">Horses Presentations</p>
                  </div>
                  <div className="sps">
                    <p className=" gy mtop">
                      Get up close with our majestic horses as we showcase
                      different breeds.
                    </p>
                  </div>
                </div>
                <div className="sps">
                  <div className="btns">
                    <i className="fa-solid fa-arrow-right rt2  " />
                  </div>
                </div>
              </div>
              <div className="lineg" />
              <div
                style={{ display: "flex", flexDirection: "row" }}
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div className="rc">
                  <div className="sps1">
                    <p className="f20">Horse Stunt Show</p>
                  </div>
                  <div className="sps">
                    <p className=" gy mtop">
                      An action-packed show that highlights the agility and bond
                      between
                    </p>
                  </div>
                </div>
                <div className="sps">
                  <div className="btns">
                    <i className="fa-solid fa-arrow-right rt2  " />
                  </div>
                </div>
              </div>
              <div className="lineg" />
              <div
                style={{ display: "flex", flexDirection: "row" }}
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div className="rc">
                  <div className="sps1">
                    <p className="f20">Qualification Round</p>
                  </div>
                  <div className="sps">
                    <p className=" gy mtop">
                      The opening stage where riders display their skills to
                      secure a place.
                    </p>
                  </div>
                </div>
                <div className="sps">
                  <div className="btns">
                    <i className="fa-solid fa-arrow-right rt2  " />
                  </div>
                </div>
              </div>
              <div className="lineg" />
              <div
                style={{ display: "flex", flexDirection: "row" }}
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <div className="rc">
                  <div className="sps1">
                    <p className="f20">Semi-Final Horse Ride</p>
                  </div>
                  <div className="sps">
                    <p className="mtop gy">
                      A high-energy competition where skilled riders compete for
                      a spot
                    </p>
                  </div>
                </div>
                <div className="sps">
                  <div className="btns">
                    <i className="fa-solid fa-arrow-right rt2  " />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="Readytoride radus">
      <div className="hero-overlay1 radus">
        <div className="hero-content1">
          <div className="flex">
            <div className="left widt">
              <div
                className="btn1 mt50"
                style={{ width: 250 }}
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <p className="f14 clr1" style={{ color: "white" }}>
                  {" "}
                  <span className="dot" />
                  Ready to Ride? Contact Us Today!
                </p>
              </div>
              <h1 className="f46 typing-container">
                {" "}
                Connect with us and experience{" "}
                <span className="fontz">personalized guidance</span>
              </h1>
              <p
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={800}
              >
                Whether you’re a first-time rider or a seasoned equestrian, our
                dedicated team is here to provide personalized guidance tailored
                to your goals.
              </p>
              <button
                className="ripple-btn white m20 no-dot"
                data-text="Contact Us Today!"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              />
              <div
                className="line7 mt50"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={1000}
              />
              <div
                className="rc"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={1000}
              >
                <div>
                  <p>
                    <span className="check-icon mt20 se1" />
                    Expert Riding Lessons
                  </p>
                </div>
                <div>
                  <p>
                    <span className="check-icon mt20 se" /> Trail Riding
                    Adventures
                  </p>
                </div>
                <div>
                  <p>
                    <span className="check-icon mt20 se" /> Community &amp;
                    Events
                  </p>
                </div>
              </div>
            </div>
            <div className="right">
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/cta-box-image.png"
                alt=""
                className="imgclass"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="faq bg-1 pdtb pdtb2">
      <div className="contains1">
        <div
          className="contains-wrapper"
          style={{
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            flexDirection: "column",
            alignItems: "center"
          }}
        >
          <div
            className="btn1"
            style={{ width: 150 }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <p className="f14 ">
              {" "}
              <span className="dot" />
              Our Testimonials
            </p>{" "}
            <br />
          </div>
          <h1 className="f46 typing-container">
            Hear from riders who found their <br />{" "}
            <span className="fontz">second home here</span>
          </h1>
          <div className="flex mt50">
            <div className="left ">
              <div className="img-contz">
                <div className="cover1">
                  <div className="splash">
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/testimonial-image.jpg"
                      alt=""
                      className="imgg"
                    />
                    <div className="diagonal-overlay" />
                  </div>
                </div>
                <div className="boxzs" style={{ color: "white" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      alignItems: "center"
                    }}
                  >
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
                      alt=""
                      className="imgi"
                    />
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-2.jpg"
                      alt=""
                      className="imgi"
                    />
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-3.jpg"
                      alt=""
                      className="imgi"
                    />
                    <img
                      src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-4.jpg"
                      alt=""
                      className="imgi"
                    />
                    <span className="imgp1">+</span>
                  </div>
                  <p className="f16 pick">Google Rating</p>
                  <p style={{ marginBottom: 0, marginTop: 0 }}>
                    5.0{" "}
                    <span className="star-rating fz" style={{ color: "coral" }}>
                      {" "}
                      ★★★★★
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="right mtrs right-5 pt-s">
              <div className="cardx alin-r">
                <h1
                  className="f30"
                  data-aos="fade-up"
                  data-aos-delay={1000}
                  data-aos-duration={500}
                >
                  What Our Riders Say
                </h1>
                <p
                  className="gy"
                  data-aos="fade-up"
                  data-aos-delay={1000}
                  data-aos-duration={800}
                >
                  Discover heartfelt stories &amp; honest feedback from our
                  riders &amp; experience growth, joy &amp; unforgettable
                  moments.
                </p>
                <div className="carousel-wrapper">
                  <div className="testimonial-slider slider">
                    <div className="item">
                      <div className="mt50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={31}
                          height={24}
                          viewBox="0 0 31 24"
                          fill="currentColor"
                          style={{ color: "coral" }}
                        >
                          <path d="M2.78652 22.0588C1.04495 20.1177 1.57361e-06 18 1.26506e-06 14.4706C7.25095e-07 8.29412 4.35393 2.82353 10.4494 -9.13519e-07L12.0169 2.29412C6.26966 5.47059 5.05056 9.52941 4.70225 12.1765C5.57303 11.6471 6.79214 11.4706 8.01124 11.6471C11.1461 12 13.5843 14.4706 13.5843 17.8235C13.5843 19.4118 12.8876 21 11.8427 22.2353C10.6236 23.4706 9.23034 24 7.48877 24C5.57304 24 3.83146 23.1177 2.78652 22.0588ZM20.2022 22.0588C18.4607 20.1176 17.4157 18 17.4157 14.4706C17.4157 8.29412 21.7697 2.82353 27.8652 -2.43605e-06L29.4326 2.29412C23.6854 5.47059 22.4663 9.52941 22.118 12.1765C22.9888 11.6471 24.2079 11.4706 25.427 11.6471C28.5618 12 31 14.4706 31 17.8235C31 19.4118 30.3034 21 29.2584 22.2353C28.2135 23.4706 26.6461 24 24.9045 24C22.9888 24 21.2472 23.1177 20.2022 22.0588Z"></path>
                        </svg>
                      </div>
                      <div className="mt20" style={{ color: "coral" }}>
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-regular fa-star" />
                      </div>
                      <p className="gy mt20">
                        As someone who had never been on a horse before I was
                        nervous to try. But the team here made me feel so
                        comfortable from day one. The lessons are structured but
                        fun &amp; the horses are incredibly well cared for now,
                        riding has become the best part of my week.
                      </p>
                      <div className="line3" />
                      <div>
                        <div className="rc1 mt20">
                          <div>
                            <img
                              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
                              alt=""
                              className="imggg"
                            />
                          </div>
                          <div style={{ marginLeft: 20 }}>
                            <div>
                              <strong>Herman Miller</strong>
                            </div>
                            <div>
                              <p className="gy">Head Trainer</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="mt50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={31}
                          height={24}
                          viewBox="0 0 31 24"
                          fill="currentColor"
                          style={{ color: "coral" }}
                        >
                          <path d="M2.78652 22.0588C1.04495 20.1177 1.57361e-06 18 1.26506e-06 14.4706C7.25095e-07 8.29412 4.35393 2.82353 10.4494 -9.13519e-07L12.0169 2.29412C6.26966 5.47059 5.05056 9.52941 4.70225 12.1765C5.57303 11.6471 6.79214 11.4706 8.01124 11.6471C11.1461 12 13.5843 14.4706 13.5843 17.8235C13.5843 19.4118 12.8876 21 11.8427 22.2353C10.6236 23.4706 9.23034 24 7.48877 24C5.57304 24 3.83146 23.1177 2.78652 22.0588ZM20.2022 22.0588C18.4607 20.1176 17.4157 18 17.4157 14.4706C17.4157 8.29412 21.7697 2.82353 27.8652 -2.43605e-06L29.4326 2.29412C23.6854 5.47059 22.4663 9.52941 22.118 12.1765C22.9888 11.6471 24.2079 11.4706 25.427 11.6471C28.5618 12 31 14.4706 31 17.8235C31 19.4118 30.3034 21 29.2584 22.2353C28.2135 23.4706 26.6461 24 24.9045 24C22.9888 24 21.2472 23.1177 20.2022 22.0588Z"></path>
                        </svg>
                      </div>
                      <div className="mt20" style={{ color: "coral" }}>
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-regular fa-star" />
                      </div>
                      <p className="gy mt20">
                        As someone who had never been on a horse before I was
                        nervous to try. But the team here made me feel so
                        comfortable from day one. The lessons are structured but
                        fun &amp; the horses are incredibly well cared for now,
                        riding has become the best part of my week.
                      </p>
                      <div className="line3" />
                      <div>
                        <div className="rc1 mt20">
                          <div>
                            <img
                              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
                              alt=""
                              className="imggg"
                            />
                          </div>
                          <div style={{ marginLeft: 20 }}>
                            <div>
                              <strong>Herman Miller</strong>
                            </div>
                            <div>
                              <p className="gy">Head Trainer</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="item">
                      <div className="mt50">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width={31}
                          height={24}
                          viewBox="0 0 31 24"
                          fill="currentColor"
                          style={{ color: "coral" }}
                        >
                          <path d="M2.78652 22.0588C1.04495 20.1177 1.57361e-06 18 1.26506e-06 14.4706C7.25095e-07 8.29412 4.35393 2.82353 10.4494 -9.13519e-07L12.0169 2.29412C6.26966 5.47059 5.05056 9.52941 4.70225 12.1765C5.57303 11.6471 6.79214 11.4706 8.01124 11.6471C11.1461 12 13.5843 14.4706 13.5843 17.8235C13.5843 19.4118 12.8876 21 11.8427 22.2353C10.6236 23.4706 9.23034 24 7.48877 24C5.57304 24 3.83146 23.1177 2.78652 22.0588ZM20.2022 22.0588C18.4607 20.1176 17.4157 18 17.4157 14.4706C17.4157 8.29412 21.7697 2.82353 27.8652 -2.43605e-06L29.4326 2.29412C23.6854 5.47059 22.4663 9.52941 22.118 12.1765C22.9888 11.6471 24.2079 11.4706 25.427 11.6471C28.5618 12 31 14.4706 31 17.8235C31 19.4118 30.3034 21 29.2584 22.2353C28.2135 23.4706 26.6461 24 24.9045 24C22.9888 24 21.2472 23.1177 20.2022 22.0588Z"></path>
                        </svg>
                      </div>
                      <div className="mt20" style={{ color: "coral" }}>
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-solid fa-star" />
                        <i className="fa-regular fa-star" />
                      </div>
                      <p className="gy mt20">
                        As someone who had never been on a horse before I was
                        nervous to try. But the team here made me feel so
                        comfortable from day one. The lessons are structured but
                        fun &amp; the horses are incredibly well cared for now,
                        riding has become the best part of my week.
                      </p>
                      <div className="line3" />
                      <div>
                        <div className="rc1 mt20">
                          <div>
                            <img
                              src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
                              alt=""
                              className="imggg"
                            />
                          </div>
                          <div style={{ marginLeft: 20 }}>
                            <div>
                              <strong>Herman Miller</strong>
                            </div>
                            <div>
                              <p className="gy">Head Trainer</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="faq-m radus pdtb2">
      <div className="contains1 ">
        <div className="contains-wrapper">
          <div className="flex pdtb">
            <div className="left left-right">
              <div
                className="btn1"
                style={{ width: 220 }}
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={500}
              >
                <p className="f14 clr1">
                  {" "}
                  <span className="dot" />
                  Frequently Asked Questions
                </p>{" "}
                <br />
              </div>
              <h1 className="f46 typing-container">
                Helping you understand our{" "}
                <span className="fontz">equestrian services</span>
              </h1>
              <p
                className="gy"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={800}
              >
                We know starting or continuing your riding journey can bring
                lots of questions. That’s why we’ve compiled clear answers to
                the most common inquiries.
              </p>
              <div
                className="bx"
                data-aos="fade-up"
                data-aos-delay={1000}
                data-aos-duration={1000}
              >
                <div className="">
                  <div className="rc col1 pdz jkl">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center"
                      }}
                    >
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-1.jpg"
                        alt=""
                        className="imgi"
                      />
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-2.jpg"
                        alt=""
                        className="imgi"
                      />
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-3.jpg"
                        alt=""
                        className="imgi"
                      />
                      <img
                        src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/author-4.jpg"
                        alt=""
                        className="imgi"
                      />
                      <span className="imgp1">+</span>
                    </div>
                    <div>
                      <p>Over 15k+ riders strong &amp; growing.!</p>
                    </div>
                  </div>
                </div>
                <div className="rc col2 pdz jkl">
                  <div className="rc1 ">
                    <div
                      className="wrap cbg mtt"
                      style={{ backgroundColor: "white" }}
                    >
                      <i className="fa-solid fa-phone-volume wrap1 " />
                    </div>
                    <div>
                      <p className="mro">Call Us At: </p>
                      <p>+(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="rc1 ">
                    <div
                      className="wrap cbg mtt"
                      style={{ backgroundColor: "white" }}
                    >
                      <i className="fa-solid fa-envelope wrap1 " />
                    </div>
                    <div>
                      <p className="mro">Email Us: </p>
                      <p>info@domain.com</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="right ztz left-right"
              data-aos="fade-up"
              data-aos-delay={1000}
              data-aos-duration={500}
            >
              <div className="accordion mt50" id="accordionExample">
                {/* First Item: Arrow alone */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingOne">
                    <button
                      className="accordion-button f22"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      1. What types of riding lessons do you offer?
                      <span className="arrow-circle">
                        <i className="fa-solid fa-arrow-right" />
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingOne"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body ">
                      <p className="f16 gy">
                        We offer beginner, intermediate, and advanced riding
                        lessons tailored to all ages. Lessons include English
                        and Western styles, focusing on skill development,
                        safety, and horsemanship.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Second Item: Arrow inside circle */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingTwo">
                    <button
                      className="accordion-button collapsed f22"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseTwo"
                      aria-expanded="false"
                      aria-controls="collapseTwo"
                    >
                      2.Do I need prior experience to join your riding programs?
                      <span className="arrow-circle">
                        <i className="fa-solid fa-arrow-right" />
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseTwo"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingTwo"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p className="f16 gy">
                        We offer beginner, intermediate, and advanced riding
                        lessons tailored to all ages. Lessons include English
                        and Western styles, focusing on skill development,
                        safety, and horsemanship.
                      </p>
                    </div>
                  </div>
                </div>
                {/* Third Item: Arrow alone */}
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingThree">
                    <button
                      className="accordion-button collapsed f22"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseThree"
                      aria-expanded="false"
                      aria-controls="collapseThree"
                    >
                      3.What safety measures do you have in place?
                      <span className="arrow-circle">
                        <i className="fa-solid fa-arrow-right" />
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseThree"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingThree"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p className="f16 gy">
                        We offer beginner, intermediate, and advanced riding
                        lessons tailored to all ages. Lessons include English
                        and Western styles, focusing on skill development,
                        safety, and horsemanship.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFour">
                    <button
                      className="accordion-button collapsed f22"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFour"
                      aria-expanded="false"
                      aria-controls="collapseFour"
                    >
                      4.Can I board my horse at your facility?
                      <span className="arrow-circle">
                        <i className="fa-solid fa-arrow-right" />
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseFour"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFour"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p className="f16 gy">
                        We offer beginner, intermediate, and advanced riding
                        lessons tailored to all ages. Lessons include English
                        and Western styles, focusing on skill development,
                        safety, and horsemanship.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <h2 className="accordion-header" id="headingFive">
                    <button
                      className="accordion-button nn collapsed f22"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseFive"
                      aria-expanded="false"
                      aria-controls="collapseFive"
                    >
                      5.How do I book a lesson or trail ride?
                      <span className="arrow-circle">
                        <i className="fa-solid fa-arrow-right" />
                      </span>
                    </button>
                  </h2>
                  <div
                    id="collapseFive"
                    className="accordion-collapse collapse"
                    aria-labelledby="headingFive"
                    data-bs-parent="#accordionExample"
                  >
                    <div className="accordion-body">
                      <p className="f16 gy">
                        We offer beginner, intermediate, and advanced riding
                        lessons tailored to all ages. Lessons include English
                        and Western styles, focusing on skill development,
                        safety, and horsemanship.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
    <section className="blog bg-1 pdtb2">
      <div
        className="left-right"
        style={{
          textAlign: "center",
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center"
        }}
      >
        <div className="btn1">
          <p className="f14 clr1 ">
            {" "}
            <span className="dot" />
            Our Blogs
          </p>{" "}
          <br />
        </div>
        <h1 className="f46 typing-container">
          Explore tips, stories, and insights from <br />
          the <span className="fontz">equestrian world</span>
        </h1>
      </div>
      <div className="contains mt50">
        <div
          className="blog-3 bg-1"
          style={{ backgroundColor: "rgb(248, 252, 241)" }}
        >
          <div
            className="item-3 bg-1"
            style={{ backgroundColor: "rgb(248, 252, 241)" }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <div className="cover1">
              <div className="splash">
                <img
                  src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/post-1.jpg"
                  alt=""
                  width="100%"
                  className="blog-image"
                />
                <div className="diagonal-overlay" />
              </div>
            </div>
            <div className="mt20" />
            <p className="f20 mt20 ">
              5 Key Tips for Beginner Riders to Build Confidence in the Saddle
            </p>
            <p className="f16 gy">
              Understanding horse behavior is the foundation of building a
              respectful and trusting […]
            </p>
            <div className="line3" />
            <p className="f18" style={{ fontWeight: 700}}>
              Read More <i className="fa-solid fa-arrow-right rt2 mt20 clr2" />
            </p>
          </div>
          <div
            className="item-3 bg-1"
            style={{ backgroundColor: "rgb(248, 252, 241)" }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <div className="cover1">
              <div className="splash">
                <img
                  src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/post-2.jpg"
                  alt=""
                  width="100%"
                  className="blog-image"
                />
                <div className="diagonal-overlay" />
              </div>
            </div>
            <div className="mt20" />
            <p className="f20 mt20">
              Beginner’s Guide to Understanding Horse Behavior{" "}
            </p>
            <p className="f16 gy">
              Understanding horse behavior is the foundation of building a
              respectful and trusting […]
            </p>
            <div className="line3" />
            <p className="f18" style={{ fontWeight: 700}}>
              Read More <i className="fa-solid fa-arrow-right rt2 mt20 clr2" />
            </p>
          </div>
          <div
            className="item-3 bg-1"
            style={{ backgroundColor: "rgb(248, 252, 241)" }}
            data-aos="fade-up"
            data-aos-delay={1000}
            data-aos-duration={500}
          >
            <div className="cover1">
              <div className="splash">
                <img
                  src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/post-3.jpg"
                  alt=""
                  width="100%"
                  className="blog-image"
                />
                <div className="diagonal-overlay" />
              </div>
            </div>
            <div className="mt20" />
            <p className="f20 ">
              Preparing Your Horse for Competition: Essential Tips{" "}
            </p>
            <p className="f16 gy">
              Understanding horse behavior is the foundation of building a
              respectful and trusting […]
            </p>
            <div className="line3" />
            <p className="f18" style={{ fontWeight: 700 }}>
              Read More <i className="fa-solid fa-arrow-right rt2 mt20 clr2" />
            </p>
          </div>
        </div>
      </div>
    </section>
    <footer>
      <div className="footer-section radus">
        <div className="footer-flex">
          <div className="flex-footer">
            <div className="itemx">
              <img
                src="https://demo.awaikenthemes.com/rideup/wp-content/uploads/2025/08/footer-logo.svg"
                alt=""
              />
              <p className="f16h mt20">
                Whether you’re trotting for the first time or mastering advanced
                techniques.
              </p>
              <div className="email-container mt20">
                <input
                  id="emailInput"
                  type="email"
                  placeholder="Enter Your Email Address*"
                />
                <div className="emailwra">
                  <button className="email-btn" id="emailBtn">
                    <i className="fa-solid fa-arrow-right" />
                  </button>
                </div>
              </div>
              <div id="email-error-message" style={{ display: "none" }} />
            </div>
          </div>
          <div className="flex-footer-1">
            <div className="item vf">
              <h1 className="f20">Quick Links</h1>
              <ul className="custom-list mt20">
                <li className="f16h gp og-h">Home</li>
                <li className="f16h gp og-h">About Us</li>
                <li className="f16h gp og-h">Services</li>
                <li className="f16h gp og-h">Contact us</li>
              </ul>
            </div>
            <div className="item">
              <h1 className="f20">Services</h1>
              <ul className="custom-list mt20 mt40">
                <li className="f16h gp og-h">Beginner Riding Program</li>
                <li className="f16h gp og-h">Grooming &amp; Horse Care</li>
                <li className="f16h gp og-h">Horse Riding Lessons</li>
                <li className="f16h gp og-h">Horse Training Services</li>
              </ul>
            </div>
            <div className="item">
              <h1 className="f20">Contact Information</h1>
              <div className="ful">
                <div className="wrap cbg">
                  <i className="fa-solid fa-phone-volume wrap1 " />
                </div>
                <div className="tr">
                  <p className="f20 m0">Phone Number</p>
                  <p className="f16h og-h">+ (123) 456-789</p>
                </div>
              </div>
              <div className="ful">
                <div className="wrap cbg">
                  <i className="fa-solid fa-envelope wrap1 " />
                </div>
                <div className="tr">
                  <p className="f20 m0">Email Address</p>
                  <p className="f16h og-h">info@domainname.com</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="line-wrapper">
          <div className="line-footer"></div>
        </div>
        <div className="footer-bottom">
          <div>
            <p>Copyright © 2025 All Rights Reserved.</p>
          </div>
          <div
            className="wrapz"
            style={{ display: "flex", flexDirection: "row" }}
          >
            <div className="cic-wrapper cbg1">
              <i className="fa-brands fa-facebook-f cic" />
            </div>
            <div className="cic-wrapper cbg1">
              <i className="fa-brands fa-instagram cic" />
            </div>
            <div className="cic-wrapper cbg1">
              <i className="fa-brands fa-x-twitter cic" />
            </div>
            <div className="cic-wrapper cbg1">
              <i className="fa-brands fa-pinterest-p cic" />
            </div>
          </div>
        </div>
      </div>
    </footer>
  </div>
  {/* Include ScrollReveal.js */}
</>

    </div>
  );
}

export default App;
