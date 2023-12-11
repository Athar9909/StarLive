import React, { useEffect, useState } from "react";
import logo from "../../../assets/img/star_logo.png";
import print from "../../../assets/img/printer-line.svg";
import leftLine from "../../../assets/img/skip-left-line.svg";
import bookmark from "../../../assets/img/bookmark-3-line.svg";
import down from "../../../assets/img/file-download-line.svg";
import full from "../../../assets/img/fullscreen-exit-line.svg";
import page1 from "../../../assets/img/ZPage_1.jpg";
import page2 from "../../../assets/img/ZPage_2.png";
import page8 from "../../../assets/img/ZPage_8.jpg";
import rightLine from "../../../assets/img/skip-right-line.svg";

import HTMLFlipBook, { turnToNextPage } from "react-pageflip";
const PreviewCate = () => {
  const width = window.innerWidth;
  const pages = document.getElementsByClassName("page");
  const back = document.getElementById("back");
  const next = document.getElementById("next");
  const [flipKey, setFlipKey] = useState(Math.random());
  const [zoom, setZoom] = useState(1); // Initial zoom level

  const handleZoomIn = () => {
    setZoom((prevZoom) => prevZoom * 1.4); // Increase zoom level by 20%
  };

  const handleZoomOut = () => {
    setZoom((prevZoom) => (prevZoom > 0.2 ? prevZoom * 0.8 : prevZoom)); // Decrease zoom level by 20%, with a minimum of 20%
  };
  console.log(zoom);
  return (
    <div>
      <div className="star_catalog bg-white" key={flipKey}>
        <div className="star_header border-bottom">
          <div className="row align-items-center">
            <div className="col-lg-2 col-md-auto">
              <div className="star_logo">
                <img src={logo} alt="" />
              </div>
              <button onClick={() => handleZoomIn()}>
                <i class="icon-zoom-in"></i>{" "}
              </button>
              <button onClick={() => handleZoomOut()}>
                <i class="icon-zoom-in"></i>{" "}
              </button>
            </div>
            <div className="col">
              <div className="star_catalog_menus">
                <div className="catalog_menus_inner">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Print"
                    className="meeenus"
                    href="javascript:;">
                    <img src={print} alt="" />
                  </a>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Share"
                    className="meeenus"
                    href="javascript:;">
                    <img src="assets/img/share-line.svg" alt="" />
                  </a>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Click to view page thumbnail"
                    className="meeenus"
                    href="javascript:;">
                    <img src="assets/img/grid-fill.svg" alt="" />
                  </a>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Allow to search a word"
                    className="meeenus"
                    href="javascript:;">
                    <img src="assets/img/search-line.svg" alt="" />
                  </a>
                </div>
                <div className="catalog_pagination">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Click this button to view this previous page"
                    href="javascript:;">
                    <img src={leftLine} alt="" />
                  </a>
                  <div className="form-group mt-3">
                    <input
                      className="form-control"
                      type="text"
                      defaultValue="1 / 8"
                    />
                  </div>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Click this button to view this Next page"
                    href="javascript:;">
                    <img src={rightLine} alt="" />
                  </a>
                </div>
                <div className="catalog_menus_inner">
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="My Bookmark"
                    className="meeenus">
                    <img src={bookmark} alt="" />
                  </a>
                  <a
                    data-bs-toggle="tooltip"
                    data-bs-placement="bottom"
                    title="Click to View Document"
                    className="meeenus">
                    <img src={down} alt="" />
                  </a>
                </div>
              </div>
            </div>
            <div className="col-lg-2 col-md-auto">
              <div className="full_screen text-end">
                <a className="icons_btns" href="javascript:;">
                  <img src={full} alt="" />
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="star_catalog_inner position-relative">
          <a
            // onClick={() => {
            //   turnToNextPage();
            // }}
            id="back"
            className="arrow_btn previous_btn">
            <img src={leftLine} alt="" />
          </a>
          <div
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "center",
            }}>
            <HTMLFlipBook
              mobileScrollSupport={true}
              autoSize={true}
              width={width < 450 ? 200 : 400}
              height={width < 450 ? 260 : 520}>
              <div className="pages">
                {" "}
                {/* <img
                className="bg_img"
                src={require("../../../assets/img/ZPage_1.jpg")}
                alt=""
              /> */}
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
              <div className="pages">
                {" "}
                <img
                  className="bg_img"
                  src={require("../../../assets/img/ZPage_1.jpg")}
                  alt=""
                />
              </div>
            </HTMLFlipBook>
          </div>

          {/* <div className="book">
            <div id="pages" className="pages">
              <div className="page shadow  ">
                <div className="first_page">
                  <img
                    className="bg_img"
                    src={require("../../../assets/img/ZPage_1.jpg")}
                    alt=""
                  />
                  <img className="qr_img" src="assets/img/qr_img.png" alt="" />
                </div>
              </div>
              <div className="page shadow">
                <div
                  className="comman_inner_bg"
                  style={{
                    backgroundImage: "url(../../assets/img/ZPage_2.png)",
                  }}>
                  <div className="comman_head">
                    <h2>Star Impoters &amp; Wholesalers - 770.908.0404</h2>
                  </div>
                  <div className="product_main">
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                    <a href="javascript:;" className="product_box">
                      <div className="product_img">
                        <img src="assets/img/product1.png" alt="" />
                      </div>
                      <h2>
                        Show Cone <br /> 15CT/2PK <br />
                        $8.49{" "}
                      </h2>
                    </a>
                  </div>
                </div>
              </div>
              <div className="page shadow">
                <div
                  className="comman_inner_bg"
                  style={{ backgroundImage: "url(assets/img/ZPage_2.png)" }}>
                  <div className="comman_head">
                    <h2>Star Impoters &amp; Wholesalers - 770.908.0404</h2>
                  </div>
                  <div className="wholesale_main">
                    <a href="javascript:;" className="wholesale_img">
                      <img src="assets/img/wholesale.png" alt="" />
                    </a>
                    <a href="javascript:;" className="wholesale_img">
                      <img src="assets/img/wholesale.png" alt="" />
                    </a>
                    <a href="javascript:;" className="wholesale_img">
                      <img src="assets/img/wholesale.png" alt="" />
                    </a>
                    <div className="bottom_line text-center">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    </div>
                  </div>
                </div>
              </div>
              <div className="page shadow">
                <div
                  className="comman_inner_bg"
                  style={{ backgroundImage: "url(assets/img/ZPage_2.png)" }}>
                  <div className="comman_head">
                    <h2>Star Impoters &amp; Wholesalers - 770.908.0404</h2>
                  </div>
                  <div className="product_shooww">
                    <div className="row">
                      <div className="col-12">
                        <div className="product_logo">
                          <img src="assets/img/logoo.png" alt="" />
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <div className="product_sm_img">
                              <img src="assets/img/producttt.png" alt="" />
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="product_sm_img">
                              <img src="assets/img/producttt.png" alt="" />
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="product_sm_img">
                              <img src="assets/img/producttt.png" alt="" />
                            </div>
                          </div>
                          <div className="col-md-6 mb-3">
                            <div className="product_sm_img">
                              <img src="assets/img/producttt.png" alt="" />
                            </div>
                          </div>
                          <div className="col-12">
                            <div className="show_details">
                              Lil Leaf 10/3pk-3f$2.99 <br /> $17.99
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="product_shooww_img text-center">
                          <img src="assets/img/productbig.png" alt="" />
                          <div className="show_details">
                            Lil Leaf 10/3pk-3f$2.99 <br /> $17.99
                          </div>
                        </div>
                      </div>
                      <div className="col-12 mt-3">
                        <div className="bottom_line text-center">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="page shadow">
                <div className="first_page">
                  <img className="bg_img" src="assets/img/ZPage_8.jpg" alt="" />
                  <img
                    className="qr_img_end"
                    src="assets/img/qr_img.png"
                    alt=""
                  />
                </div>
              </div>
              <div className="page shadow">
                <div className="first_page">
                  <img className="bg_img" src="assets/img/ZPage_8.jpg" alt="" />
                  <img
                    className="qr_img_end"
                    src="assets/img/qr_img.png"
                    alt=""
                  />
                </div>
              </div>
            </div>
          </div> */}

          <a
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top left",
            }}
            id="next"
            className="arrow_btn next_btn">
            <img src={rightLine} alt="" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default PreviewCate;
