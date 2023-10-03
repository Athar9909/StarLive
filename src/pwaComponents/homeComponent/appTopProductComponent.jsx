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

  const addToCartt = async (id, index, itm, slug) => {
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
        if (data?.message === "Flavour is not available!") {
          Swal.fire({
            title: "Please Select a Flavour!",
            text: "Click view to all flavours.",
            icon: "warning",
            confirmButtonText: "Okay",
          }).then((res) => {
            navigate(`/app/product-detail/${slug}`, { state: "hii" });
          });
        }
        // if (data?.error) {
        //   navigate("/app/login");
        // }
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
      if (data?.message === "Flavour is not available!") {
        Swal.fire({
          title: "Please Select a Flavour!",
          text: "Click view to all flavours.",
          icon: "warning",
          confirmButtonText: "Okay",
        }).then((res) => {
          navigate(`/app/product-detail/${slug}`, { state: "hii" });
        });
      }
      // if (data?.error) {
      //   navigate("/app/login");
      // }
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

          {/* {browserName === "WebKit" || browserName === "Chrome WebView" ? (
            <div className="row px-3 ">
              {(product || [])
                .filter(
                  (itm, idx) =>
                    itm.category != "639a042ff2f72167b43774de" &&
                    itm.category != "639a7617f2f72167b4377754" &&
                    idx < 4 &&
                    itm?.productId?.isTobaccoProduct != true
                )
                .map((item, index) => (
                  <div class="col-6 mb-3">
                    <div class="cardTp">
                      <span className="product-feat-label px-2">
                        Hot{item?.price ? "-" : ""}
                        <span className=" mx-1  fs-5 fw-bold">
                          {item?.price ? "$" + item.price : ""}
                        </span>
                      </span>
                      <div class="card-img">
                        <div class="">
                          <img
                            class="img"
                            style={{
                              height: "7rem",
                              borderRadius: "8px",
                            }}
                            src={
                              item?.productId.type?.flavourImage
                                ? item?.productId.type?.flavourImage
                                : item?.productId?.productImage ||
                                  require("../../assets/img/product.jpg")
                            }
                            alt="Product Image not updated"
                          />
                        </div>
                      </div>
                      <div class="cardTp-title mb-0">
                        <Link
                          to={`/app/product-detail/${item?.productId?.slug}`}
                          state={{ type: item?.productId?.type }}>
                          {item?.productId?.unitName?.slice(0, 28)}
                          <span>
                            {item?.productId.type
                              ? item?.productId.type?.flavour
                              : ""}
                          </span>
                        </Link>
                      </div>

                      <hr class="cardTp-divider mb-0" />
                      <div class="cardTp-footer  mt-0">
                        <a class="bg-white">
                          <i
                            class="fa-solid fa-eye"
                            onClick={() => {
                              navigate(
                                `/app/product-detail/${item?.productId?.slug}`,
                                {
                                  state: { type: item?.productId?.type },
                                }
                              );
                            }}></i>
                          <i
                            class="fa-solid fa-cart-plus mx-2"
                            onClick={() =>
                              addToCartt(
                                item?.productId?._id,
                                index,
                                item,
                                item?.productId?.slug
                              )
                            }></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ) : ( */}
            <div className="row px-3 ">
              {(product || [])
                .filter((itm, idx) => idx < 4)
                .map((item, index) => (
                  <div class="col-6 mb-3">
                    <div class="cardTp">
                      <span className="product-feat-label px-2">
                        HOT{item?.price ? "-" : ""}
                        <span className=" mx-1  fs-5 fw-bold">
                          {item?.price ? "$" + item.price : ""}
                        </span>
                      </span>
                      <div class="card-img">
                        <div class="">
                          <img
                            class="img"
                            style={{
                              height: "7rem",
                              borderRadius: "8px",
                            }}
                            src={
                              item?.productId?.type?.flavourImage
                                ? item?.productId?.type?.flavourImage
                                : item?.productId?.productImage ||
                                  require("../../assets/img/product.jpg")
                            }
                            alt="Product Image not updated"
                          />
                        </div>
                      </div>
                      <div class="cardTp-title mb-0">
                        <Link
                          to={`/app/product-detail/${item?.productId?.slug}`}
                          state={{ type: item?.productId?.type }}>
                          {item?.productId?.unitName?.slice(0, 28)}
                          <span>
                            {item?.productId?.type
                              ? item?.productId?.type?.flavour
                              : ""}
                          </span>
                        </Link>
                      </div>

                      <hr class="cardTp-divider mb-0" />
                      <div class="cardTp-footer  mt-0">
                        <a class="bg-white">
                          <i
                            class="fa-solid fa-eye"
                            onClick={() => {
                              navigate(
                                `/app/product-detail/${item?.productId?.slug}`,
                                {
                                  state: { type: item?.productId?.type },
                                }
                              );
                            }}></i>
                          <i
                            class="fa-solid fa-cart-plus mx-2"
                            onClick={() =>
                              addToCartt(
                                item?.productId?._id,
                                index,
                                item,
                                item?.productId?.slug
                              )
                            }></i>
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          {/* )} */}
          
        </div>
      </div>
    </>
  );
}

export default TopProduct;
