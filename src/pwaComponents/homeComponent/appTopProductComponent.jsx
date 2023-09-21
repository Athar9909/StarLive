import React, { useEffect, useState } from "react";
import "owl.carousel/dist/assets/owl.carousel.css";
import { Link } from "react-router-dom";
import {
  addToCart,
  getFeaturedProd,
} from "../httpServices/homeHttpService/homeHttpService";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { browserName } from "react-device-detect";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation, FreeMode, Grid } from "swiper";

function TopProduct() {
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const userData = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const getPromotionProd = `${process.env.REACT_APP_APIENDPOINTNEW}user/getPromotion`;
  const [product, setProduct] = useState([]);
  const [heart, setHeart] = useState(false);
  const [userDetail, setUserDetail] = useState([]);
  let { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    userInfo();
    getPromotionsFeatured();
  }, []);

  let token = localStorage.getItem("token-user");

  const userInfo = async () => {
    await axios.get(userData).then((res) => {
      setUserDetail(res?.data?.results);
    });
  };

  const getPromotionsFeatured = async () => {
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
    getPromotionsFeatured();
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
    getPromotionsFeatured();
  };

  return (
    <>
      <div className="top-products-area pb-3 ">
        <div className="container">
          <div className=" d-flex align-items-center justify-content-between dir-rtl mt-2 mb-3">
            <h6 className="fs-5 fw-bold">Featured Products</h6>
            <Link className="btn p-0" to="/app/product-list">
              View All<i className="ms-1 fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>

          {browserName === "WebKit" || browserName === "Chrome WebView" ? (
            <div className="row px-3 ">
              {(product || [])
                .filter(
                  (itm, idx) =>
                    itm.category != "639a042ff2f72167b43774de" &&
                    itm.category != "639a7617f2f72167b4377754"
                )
                .map((item, index) => (
                  <div class="col-6 mb-3">
                    <div class="cardTp">
                      <div class="cardTp-img">
                        <div class="">
                          <img
                            class="img"
                            src={
                              item?.productId.type?.flavourImage
                                ? item?.productId.type?.flavourImage
                                : require("../../assets/img/product.jpg")
                            }
                            alt="Product Image not updated"
                          />
                        </div>
                      </div>
                      <div class="cardTp-title mb-0">
                        <Link
                          to={`/app/product-detail/${item?.productId?.slug}`}
                          state={{ type: item?.productId?.type }}>
                          {item?.productId?.unitName?.slice(0, 28) +
                            "-" +
                            item?.productId.type?.flavour}
                        </Link>
                      </div>

                      <hr class="cardTp-divider mb-0" />
                      <div class="cardTp-footer ">
                        <button
                          class="cardTp-btn "
                          onClick={() =>
                            addToCartt(item?.productId?._id, index, item)
                          }>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path>
                            <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                            <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                            <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* <div class="card product-card w-100">
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
                                    addToFav(index,item);
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
                      </div> */}
                  </div>
                ))}
            </div>
          ) : (
            <div className="row px-3 ">
              {(product || [])
                .filter((itm, idx) => idx < 4)
                .map((item, index) => (
                  <div class="col-6 mb-3">
                    <div class="cardTp">
                      <div class="cardTp-img">
                        <div class="">
                          <img
                            class="img"
                            src={
                              item?.productId.type?.flavourImage
                                ? item?.productId.type?.flavourImage
                                : require("../../assets/img/product.jpg")
                            }
                            alt="Product Image not updated"
                          />
                        </div>
                      </div>
                      <div class="cardTp-title mb-0">
                        <Link
                          to={`/app/product-detail/${item?.productId?.slug}`}
                          state={{ type: item?.productId?.type }}>
                          {item?.productId?.unitName?.slice(0, 28) +
                            "-" +
                            item?.productId.type?.flavour}
                        </Link>
                      </div>

                      <hr class="cardTp-divider mb-0" />
                      <div class="cardTp-footer ">
                        <button
                          class="cardTp-btn "
                          onClick={() =>
                            addToCartt(item?.productId?._id, index, item)
                          }>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512">
                            <path d="m397.78 316h-205.13a15 15 0 0 1 -14.65-11.67l-34.54-150.48a15 15 0 0 1 14.62-18.36h274.27a15 15 0 0 1 14.65 18.36l-34.6 150.48a15 15 0 0 1 -14.62 11.67zm-193.19-30h181.25l27.67-120.48h-236.6z"></path>
                            <path d="m222 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                            <path d="m368.42 450a57.48 57.48 0 1 1 57.48-57.48 57.54 57.54 0 0 1 -57.48 57.48zm0-84.95a27.48 27.48 0 1 0 27.48 27.47 27.5 27.5 0 0 0 -27.48-27.47z"></path>
                            <path d="m158.08 165.49a15 15 0 0 1 -14.23-10.26l-25.71-77.23h-47.44a15 15 0 1 1 0-30h58.3a15 15 0 0 1 14.23 10.26l29.13 87.49a15 15 0 0 1 -14.23 19.74z"></path>
                          </svg>
                        </button>
                      </div>
                    </div>
                    {/* <div class="card product-card w-100">
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
                                    addToFav(index,item);
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
                      </div> */}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TopProduct;
