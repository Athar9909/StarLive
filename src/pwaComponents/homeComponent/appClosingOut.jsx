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

function AppClosingOut() {
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
    getProductList();
    userInfo();
  }, []);
  let token = localStorage.getItem("token-user");

  const userInfo = async () => {
    await axios.get(userData).then((res) => {
      setUserDetail(res?.data?.results);
    });
  };

  const getProductList = async () => {
    const { data } = await axios.post(getPromotionProd, {
      type: "CloseOut",
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
  return (
    <>
      <div className="top-products-area pb-3 ">
        <div className="container">
          <div className=" d-flex align-items-center justify-content-between dir-rtl mt-2 mb-3">
            <h6 className="fs-5 fw-bold text-danger">CLOSING OUT DEALS</h6>
            <Link
              className="btn p-0 text-white"
              to="/app/product-list/Close-Out">
              View All<i className="ms-1 fa-solid fa-arrow-right-long"></i>
            </Link>
          </div>

          {/* {browserName === "WebKit" || browserName === "Chrome WebView" ? (
            <div className="row px-3 ">
              <Swiper
                slidesPerView={2}
                spaceBetween={8}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: true,
                  reverseDirection: true,
                  waitForTransition: true,
                }}
                loop={true}
                modules={[FreeMode, Pagination, Autoplay, Navigation]}
                className="">
                {(product || [])
                  .filter(
                    (itm, idx) =>
                      itm.category != "639a042ff2f72167b43774de" &&
                      itm.category != "639a7617f2f72167b4377754" &&
                      itm?.productId?.isTobaccoProduct != true
                  )
                  .map((item, index) => (
                    <SwiperSlide key={index} className="main_hot">
                      <div class="">
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
                                    item,
                                    item?.productId?.slug
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
                            </Link>
                            <div class="row mt-1 d-flex align-items-center justify-content-between">
                              <div class="col-auto">
                                <Link
                                  class="product-title"
                                  to={`/app/product-detail/${item?.productId?.slug}`}
                                  state={{ type: item?.productId?.type }}>
                                  {item?.productId?.unitName?.slice(0, 28)}
                                  <span>
                                    {item?.productId.type
                                      ? item?.productId.type?.flavour
                                      : ""}
                                  </span>
                                </Link>
                                {item?.price ? (
                                  <p className="mb-0">
                                    {" "}
                                    {item?.price ? "Price-" : ""}
                                    <span className=" mx-1 text-danger fw-bold mb-0">
                                      {item?.price ? "$" + item.price : ""}
                                    </span>
                                  </p>
                                ) : (
                                  ""
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
              </Swiper>
            </div>
          ) : ( */}
            <div className="row px-3 ">
              <Swiper
                slidesPerView={2}
                spaceBetween={8}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: true,
                  reverseDirection: true,
                  waitForTransition: true,
                }}
                loop={true}
                modules={[FreeMode, Pagination, Autoplay, Navigation]}
                className="">
                {(product || []).map((item, index) => (
                  <SwiperSlide key={index} className="main_hot">
                    <div class="">
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
                                  item,
                                  item?.productId?.slug
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
                          </Link>

                          <div class="row mt-1 d-flex align-items-center justify-content-between">
                            <div class="col-auto">
                              <Link
                                class="product-title"
                                to={`/app/product-detail/${item?.productId?.slug}`}
                                state={{ type: item?.productId?.type }}>
                                {item?.productId?.unitName?.slice(0, 28)}
                                <span>
                                  {item?.productId?.type
                                    ? item?.productId?.type?.flavour
                                    : ""}
                                </span>
                              </Link>
                              {item?.price ? (
                                <p className="mb-0">
                                  {" "}
                                  {item?.price ? "Price-" : ""}
                                  <span className=" mx-1 text-danger fw-bold mb-0">
                                    {item?.price ? "$" + item.price : ""}
                                  </span>
                                </p>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          {/* )} */}
        </div>
      </div>
    </>
  );
}

export default AppClosingOut;
