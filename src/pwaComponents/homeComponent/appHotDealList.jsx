import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import AppFooter from "./appFooter";
import "owl.carousel/dist/assets/owl.carousel.css";
import {
  addToCart,
  getAllProducts,
  getByCategory,
} from "../httpServices/homeHttpService/homeHttpService";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import WebHeader2 from "./webHeader2";
import Swal from "sweetalert2";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { charSearchKey } from "../../selecter";
import Search from "./search";
import { browserName } from "react-device-detect";
import { appFeaturedProd } from "../../atom";

function AppHotDealList() {
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const getPromotionProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/getPromotion`;
  const userData = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const [userDetail, setUserDetail] = useState([]);
  const [product, setProduct] = useState([]);
  const [heart, setHeart] = useState(false);
  const navigate = useNavigate();
  let ref = useRef();
  let token = localStorage.getItem("token-user");
  const searchKey = useRecoilValue(charSearchKey);
  console.log(searchKey);

  useEffect(() => {
    getProductList();
    userInfo();
  }, []);

  const userInfo = async () => {
    await axios.get(userData).then((res) => {
      setUserDetail(res?.data?.results);
    });
  };

  const getProductList = async () => {
    const { data } = await axios.post(getPromotionProd, {
      type: "Featured",
    });

    if (!data.error) {
      setProduct(data?.results.promotion?.products);
    }
  };

  const addToCartt = async (id, index, itm) => {
    if (itm?.category?.isTobacco || itm?.subCategory?.isTobacco) {
      if (!userDetail?.istobaccoLicenceExpired) {
        const formData = {
          productId: id,
          quantity: 1,
          flavour: itm?.productId?.type,
        };
        const { data } = await addToCart(formData);
        if (!data.error) {
          navigate("/app/cart");
        }
        if (data?.error) {
          navigate("/app/login");
        }
      } else {
        Swal.fire({
          title: "Your Tobacco licence is Expired/Invalid!",
          text: "*Licence is Required for this product.",
          icon: "warning",
          confirmButtonText: "Okay",
        });
      }
    } else {
      const formData = {
        productId: id,
        quantity: 1,
        flavour: itm?.productId?.type,
      };
      const { data } = await addToCart(formData);
      if (!data.error) {
        navigate("/app/cart");
      }
      if (data?.error) {
        navigate("/app/login");
      }
    }
  };

  const addToFav = async (index, itm) => {
    await axios
      .post(addFav, {
        productId: itm?.productId?._id,
        flavour: itm?.productId?.type,
      })
      .catch((err) => {
        // toast.success(res?.data?.message);
        if (err) {
          Swal.fire({
            title: "Please Login To Continue",
            icon: "error",
            button: "ok",
          });
        }
      });
    getProductList();
    setHeart(!heart);
  };
  const rmvFromFav = async (index, itm) => {
    await axios
      .post(rmvFav, {
        productId: itm?.productId?._id,
        flavour: itm?.productId?.type,
      })
      .then((res) => {
        if (!res.error) {
          setHeart(!heart);
        }
      });
    getProductList();
  };

  useEffect(() => {
    document.addEventListener("click", handleOutsideClick, true);
    return () =>
      document.removeEventListener("click", handleOutsideClick, true);
  }, []);
  const handleOutsideClick = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      document.getElementById("closeModal").click();
    }
  };
  return (
    <>
      <div className="star_imp_app">
        <div class="header-area" id="headerArea" ref={ref}>
          <div class="container h-100 d-flex align-items-center justify-content-between rtl-flex-d-row-r">
            <div class="back-button me-2">
              <Link to="/app/home">
                <i className="fa-solid fa-house"></i>
              </Link>
            </div>

            <div class="page-heading">
              <h6 class="mb-0">HOT DEALS PRODUCTS</h6>
            </div>

            <div
              class="suha-navbar-toggler ms-2"
              data-bs-toggle="offcanvas"
              data-bs-target="#suhaOffcanvas"
              aria-controls="suhaOffcanvas">
              <div>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        </div>
        <WebHeader2 />

        <div class="page-content-wrapper">
          <Search />
          <div>
            {browserName === "WebKit" || browserName === "Chrome WebView" ? (
              <div>
                {searchKey?.length ? null : (
                  <div className="row p-3">
                    {(product || [])
                      .filter(
                        (itm, idx) =>
                          itm.category != "639a042ff2f72167b43774de" &&
                          itm.category != "639a7617f2f72167b4377754"
                      )
                      .map((item, index) => (
                        <div class="col-6 mb-3">
                          <div class="card product-card w-100">
                            <div class="card-body">
                              <div class="col-auto">
                                <Link
                                  class="cart_bttn text-decoration-none"
                                  to=""
                                  onClick={() =>
                                    addToCartt(
                                      item?.productId?._id,
                                      index,
                                      item
                                    )
                                  }>
                                  <i class="fa-light fa-plus "></i>
                                </Link>
                              </div>
                              {token?.length ? (
                                <a class="wishlist-btn">
                                  {item?.productId?.favourite ? (
                                    <i
                                      class="fa fa-heart"
                                      onClick={() => {
                                        rmvFromFav(index, item);
                                      }}
                                      style={{ color: "#3e4093 " }}
                                    />
                                  ) : (
                                    <i
                                      class="fa fa-heart"
                                      onClick={() => {
                                        addToFav(index, item);
                                      }}
                                      style={{ color: "#E1E1E1 " }}
                                    />
                                  )}
                                </a>
                              ) : null}

                              <Link
                                class="product-thumbnail d-block"
                                to={`/app/product-detail/${item?.productId?.slug}`}
                                state={{ type: item?.productId?.type }}>
                                <img
                                  class="mb-2"
                                  src={
                                    item?.productId.type?.flavourImage
                                      ? item?.productId.type?.flavourImage
                                      : require("../../assets/img/product.jpg")
                                  }
                                  alt="Product Image not updated"
                                />
                              </Link>
                              <div class="row mt-1 d-flex align-items-center justify-content-between">
                                <div class="col-auto">
                                  <Link
                                    class="product-title"
                                    to={`/app/product-detail/${item?.productId?.slug}`}
                                    state={{ type: item?.productId?.type }}>
                                    {item?.productId?.unitName +
                                      "-" +
                                      item?.productId.type?.flavour}
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            ) : (
              <div>
                {searchKey?.length ? null : (
                  <div className="row p-3 ">
                    {(product || []).map((item, index) => (
                      <div class="col-6 mb-3">
                        <div class="card product-card w-100">
                          <div class="card-body">
                            <div class="col-auto">
                              <Link
                                class="cart_bttn text-decoration-none"
                                to=""
                                onClick={() =>
                                  addToCartt(item?.productId?._id, index, item)
                                }>
                                <i class="fa-light fa-plus "></i>
                              </Link>
                            </div>
                            {token?.length ? (
                              <a class="wishlist-btn">
                                {item?.productId?.favourite ? (
                                  <i
                                    class="fa fa-heart"
                                    onClick={() => {
                                      rmvFromFav(index, item);
                                    }}
                                    style={{ color: "#3e4093 " }}
                                  />
                                ) : (
                                  <i
                                    class="fa fa-heart"
                                    onClick={() => {
                                      addToFav(index, item);
                                    }}
                                    style={{ color: "#E1E1E1 " }}
                                  />
                                )}
                              </a>
                            ) : null}

                            <Link
                              class="product-thumbnail d-block"
                              to={`/app/product-detail/${item?.productId?.slug}`}
                              state={{ type: item?.productId?.type }}>
                              <img
                                class="mb-2"
                                src={
                                  item?.productId.type?.flavourImage
                                    ? item?.productId.type?.flavourImage
                                    : require("../../assets/img/product.jpg")
                                }
                                alt="Product Image not updated"
                              />
                            </Link>
                            <div class="row mt-1 d-flex align-items-center justify-content-between">
                              <div class="col-auto">
                                <Link
                                  class="product-title"
                                  to={`/app/product-detail/${item?.productId?.slug}`}
                                  state={{ type: item?.productId?.type }}>
                                  {item?.productId?.unitName +
                                    "-" +
                                    item?.productId.type?.flavour}
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
          {/* {browserName === "WebKit" || browserName === "Chrome WebView" ? (
            <div>
              {searchKey?.length ? null : (
                <div class="container">
                  <button className="bg-white fw-bold border rounded-end">
                    {activePage}
                  </button>
                  <div class="">
                    {product?.length ? (
                      <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-1 mb-1">
                        <div
                          class={
                            activePage <= 1
                              ? "opacity-0"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage <= 1
                                ? setActivePage(1)
                                : setActivePage(activePage - 1)
                            }
                          >
                            <i class="fa-solid fa-arrow-left-long"></i> Prev
                          </Link>
                        </div>
                        <div
                          class={
                            activePage === maxPage
                              ? "d-none"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage === maxPage
                                ? setActivePage(maxPage)
                                : setActivePage(activePage + 1)
                            }
                          >
                            Next <i class="fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>
                      </div>
                    ) : null}
                    <div class="row g-2 product_list_main">
                      {(product || [])
                        ?.filter(
                          (itm, idx) =>
                            // itm.category._id != "639a042ff2f72167b43774de" &&
                            itm.category._id != "639a7617f2f72167b4377754"
                        )
                        .map((item, index) => {
                          return (
                            <div class="col-6 col-md-4 d-flex align-items-stretch">
                              <div class="card product-card w-100">
                                <div class="card-body">
                                  {token?.length ? (
                                    <a class="wishlist-btn">
                                      {item?.favourite ? (
                                        <i
                                          class="fa fa-heart"
                                          onClick={() => {
                                            rmvFromFav(index);
                                          }}
                                          style={{ color: "#3e4093 " }}
                                        />
                                      ) : (
                                        <i
                                          class="fa fa-heart"
                                          onClick={() => {
                                            addToFav(index);
                                          }}
                                          style={{ color: "#E1E1E1 " }}
                                        />
                                      )}
                                    </a>
                                  ) : null}
                                  <Link
                                    class="product-thumbnail d-block"
                                    to={`/app/product-detail/${item?.slug}`}
                                    state={{ type: item?.type[0] }}
                                  >
                                    <img
                                      class="mb-2"
                                      src={
                                        item.type[0]?.flavourImage
                                          ? item.type[0]?.flavourImage
                                          : require("../../assets/img/product.jpg")
                                      }
                                    />
                                  </Link>
                                  <div class="row mt-1 d-flex align-items-center justify-content-between">
                                    <div class="col">
                                      <a class="product-title">
                                        {item?.unitName +
                                          "-" +
                                          item.type[0]?.flavour}
                                      </a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          );
                        })}
                    </div>

                    {product?.length ? (
                      <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-3">
                        <div
                          class={
                            activePage <= 1
                              ? "opacity-0"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage <= 1
                                ? setActivePage(1)
                                : setActivePage(activePage - 1)
                            }
                          >
                            <i class="fa-solid fa-arrow-left-long"></i> Prev
                          </Link>
                        </div>
                        <div
                          class={
                            activePage === maxPage
                              ? "d-none"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage === maxPage
                                ? setActivePage(maxPage)
                                : setActivePage(activePage + 1)
                            }
                          >
                            Next <i class="fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="container">
              {searchKey?.length ? null : (
                <div class="py-3">
                  <button className="bg-white fw-bold border rounded-end">
                    {activePage}
                  </button>
                  <div class="">
                    {product?.length ? (
                      <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-1 mb-1">
                        <div
                          class={
                            activePage <= 1
                              ? "opacity-0"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage <= 1
                                ? setActivePage(1)
                                : setActivePage(activePage - 1)
                            }
                          >
                            <i class="fa-solid fa-arrow-left-long"></i> Prev
                          </Link>
                        </div>
                        <div
                          class={
                            activePage === maxPage
                              ? "d-none"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage === maxPage
                                ? setActivePage(maxPage)
                                : setActivePage(activePage + 1)
                            }
                          >
                            Next <i class="fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>
                      </div>
                    ) : null}
                    <div class="row g-2 product_list_main">
                      {(product || [])?.map((item, index) => {
                        return (
                          <div class="col-6 col-md-4 d-flex align-items-stretch">
                            <div class="card product-card w-100">
                              <div class="card-body">
                                {token?.length ? (
                                  <a class="wishlist-btn">
                                    {item?.favourite ? (
                                      <i
                                        class="fa fa-heart"
                                        onClick={() => {
                                          rmvFromFav(index);
                                        }}
                                        style={{ color: "#3e4093 " }}
                                      />
                                    ) : (
                                      <i
                                        class="fa fa-heart"
                                        onClick={() => {
                                          addToFav(index);
                                        }}
                                        style={{ color: "#E1E1E1 " }}
                                      />
                                    )}
                                  </a>
                                ) : null}
                                <Link
                                  onClick={() => {
                                    setData([{ page: activePage }]);
                                  }}
                                  class="product-thumbnail d-block"
                                  to={`/app/product-detail/${item?.slug}`}
                                  state={{ type: item?.type[0] }}
                                >
                                  <img
                                    class="mb-2"
                                    src={
                                      item.type[0]?.flavourImage
                                        ? item.type[0]?.flavourImage
                                        : require("../../assets/img/product.jpg")
                                    }
                                  />
                                </Link>
                                <div class="row mt-1 d-flex align-items-center justify-content-between">
                                  <div class="col">
                                    <a class="product-title">
                                      {item?.unitName +
                                        "-" +
                                        item.type[0]?.flavour}
                                    </a>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {product?.length ? (
                      <div className="col-lg-12 col-sm-12 d-flex justify-content-between mt-3">
                        <div
                          class={
                            activePage <= 1
                              ? "opacity-0"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage <= 1
                                ? setActivePage(1)
                                : setActivePage(activePage - 1)
                            }
                          >
                            <i class="fa-solid fa-arrow-left-long"></i> Prev
                          </Link>
                        </div>
                        <div
                          class={
                            activePage === maxPage
                              ? "d-none"
                              : "back-button me-2 me-2 "
                          }
                        >
                          <Link
                            state={{ naek: "ki" }}
                            onClick={() =>
                              activePage === maxPage
                                ? setActivePage(maxPage)
                                : setActivePage(activePage + 1)
                            }
                          >
                            Next <i class="fa-solid fa-arrow-right-long"></i>
                          </Link>
                        </div>
                      </div>
                    ) : null}
                  </div>
                </div>
              )}
            </div>
          )} */}
        </div>

        <AppFooter />
      </div>
    </>
  );
}

export default AppHotDealList;
