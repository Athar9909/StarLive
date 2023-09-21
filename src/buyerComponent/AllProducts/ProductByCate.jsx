import React, { useState } from "react";
import Navbar from "../Homepage/Navbar";
import { Link, useLocation, useParams } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import Footer from "../Footer/Footer";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import backGround from "../../assets/img/banner_img2.jpg";
import {
  pageCategory,
  pageCategoryData,
  pageSubCategoryData,
} from "../../atom";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { Button } from "rsuite";

const ProductByCate = () => {
  const getProduct = `${process.env.REACT_APP_APIENDPOINTNEW}user/products/getByCategory`;
  const getBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/brands/getBrands`;
  const getFilteredBrands = `${process.env.REACT_APP_APIENDPOINTNEW}user/filterBrands`;
  const addFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/addToFav`;
  const rmvFav = `${process.env.REACT_APP_APIENDPOINTNEW}user/fav/removeFav`;
  const location = useLocation();
  const [sortValue, setSortValue] = useState();
  const [brands, setBrands] = useState([]);
  const [message, setMessage] = useState();
  const [brandName, setBrandName] = useState();
  const [products, setProducts] = useState([]);
  const [heart, setHeart] = useState(false);
  const [maxPage, setMaxPage] = useState(1);
  const navigate = useNavigate();
  const [filtr, setFltr] = useState(false);
  const setPage = useSetRecoilState(pageCategory);
  const page = useRecoilValue(pageCategory);
  const [activePage, setActivePage] = useState(page);
  const pageData = useRecoilValue(pageCategoryData);
  const setData = useSetRecoilState(pageCategoryData);
  const [loader, setLoader] = useState(false);
  const [loaderM, setLoaderM] = useState(true);
  const [cate, setCate] = useState();

  let { id } = useParams();

  useEffect(() => {
    getProducts();
    setTimeout(() => {
      setLoaderM(false);
    }, 8000);
  }, [location, heart, activePage, page]);

  useEffect(() => {
    GetBrands();
  }, [location]);

  useEffect(() => {
    if (pageData[0]?.filtr) {
      console.log(pageData, "newww");
      setBrandName(pageData[0]?.brand);
      setSortValue(pageData[0]?.sortValue);
      setActivePage(pageData[0]?.page);
      setFltr(pageData[0]?.filtr);
      // setData([]);
    }
  }, [pageData]);

  const GetBrands = async (id) => {
    await axios
      .post(getFilteredBrands, {
        category: id,
      })
      .then((res) => {
        setBrands(res?.data.results.brands);
      });
  };

  const getProducts = async () => {
    await axios
      .post(getProduct, {
        category: pageData[0]?.category ? pageData[0]?.category : id,
        page: pageData[0]?.page ? pageData[0]?.page : activePage,
        brand: pageData[0]?.brand ? pageData[0]?.brand : filtr && brandName,
        sortBy: pageData[0]?.sortBy
          ? pageData[0]?.sortBy
          : sortValue
          ? sortValue
          : "",
      })
      .then((res) => {
        setProducts(res.data?.results.products);
        setCate(res?.data?.results.category);
        setMaxPage(res.data?.results.totalPages);
        GetBrands(res.data?.results.category?.categoryName);
        setLoaderM(false);
      });
  };

  const filterProduct = async (e) => {
    setLoader(true);
    e.preventDefault();
    await axios
      .post(getProduct, {
        category: cate?.categoryName,
        brand: brandName,
        sortBy: sortValue,
        page: 1,
      })
      .then((res) => {
        setProducts(res.data?.results.products);
        setMaxPage(res.data?.results.totalPages);
        setFltr(true);
        setActivePage(1);
        setLoader(false);
      });
  };

  const clearFilters = (e) => {
    window.location.reload(false);
  };

  const addToFav = async (index) => {
    await axios
      .post(addFav, {
        productId: products[index]?.products?._id,
      })
      .catch((err) => {
        if (err) {
          Swal.fire({
            title: "Please Login To Continue!",
            icon: "warning",
            button: "cool",
          }).then(() => navigate("/app/login"));
        }
      });
    setMessage("Added to Favourites!");
    setHeart(!heart);
  };
  const rmvFromFav = async (index) => {
    await axios.post(rmvFav, {
      productId: products[index]?.products?._id,
    });

    setMessage("Removed from Favourites!");
    setHeart(!heart);
  };

  return (
    <div>
      <Navbar />
      {loaderM ? (
        <div className="load_position">
          <div className="loader_new"></div>
        </div>
      ) : (
        <>
          <section
            className="comman_banner _banner marginTop"
            style={{
              backgroundImage: `url(${
                location?.state?.image ? location?.state?.image : backGround
              })`,
            }}>
            <div className="container">
              <div className="row">
                <div className="col-12 mt-4">
                  <h1>
                    {cate?.categoryName
                      ? cate?.categoryName
                      : id?.toLocaleUpperCase()}
                  </h1>
                  <div className="breadcrumbs">
                    <nav aria-label="breadcrumb">
                      <ol className="breadcrumb mb-0">
                        <li className="item_nanner">
                          <Link
                            to="/app/home"
                            className="text-decoration-none text-white fs-6  ">
                            Home <span className="arrow mx-2">&#9679;</span>{" "}
                          </Link>
                        </li>
                        <li className="item_nanner">
                          <Link
                            to="/app/Categories"
                            className="text-decoration-none text-white fs-6  ">
                            Categories{" "}
                            <span className="arrow mx-2">&#9679;</span>{" "}
                          </Link>
                        </li>
                        <li
                          className="breadcrumb-item fs-6"
                          aria-current="page">
                          {cate?.categoryName ? cate?.categoryName : id}
                        </li>
                      </ol>
                    </nav>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <>
            <section class="singleproduct-page comman_paddings">
              <div class="container">
                <div class="row singleproduct_divvision mx-0">
                  <div class="col-xl-3 col-lg-4 col-md-4 ps-0">
                    <div class="singleproduct-left">
                      <div class="singleproduct-left-box border-bottom border-dark mt-4">
                        <h2>Top Brands</h2>
                        <form class="singleproduct-form row" action="">
                          <div className="">
                            {(brands || [])
                              ?.filter((item, idx) => idx < 6 && idx != 0)
                              .map((item, index) => (
                                <div
                                  className="form-group col-12 mb-3 custom_radio"
                                  key={index}>
                                  <input
                                    class="d-none"
                                    type="radio"
                                    value={item?.brand?.brandName}
                                    id={item?.brand?._id}
                                    defaultChecked={
                                      pageData[0]?.brand == item?.brand?._id
                                        ? true
                                        : false
                                    }
                                    name={item?.brand?._id * index}
                                    onChange={(e) => {
                                      setBrandName(item?.brand?._id);
                                    }}
                                  />
                                  <label htmlFor={item?.brand?._id}>
                                    {item?.brand?.brandName}
                                  </label>
                                </div>
                              ))}
                          </div>
                          <button className="d-none" id="reset1" type="reset">
                            reset
                          </button>
                        </form>
                        <a
                          class="moreee d-flex mt-3 text-decoration-none"
                          onClick={() => {
                            navigate("/app/brands");
                          }}>
                          More Brands
                        </a>
                      </div>
                      <div class="singleproduct-left-box">
                        <h2>Sort By</h2>
                        <form class="singleproduct-form row" action="">
                          <div class="form-group col-12 mb-3 custom_radio">
                            <input
                              type="radio"
                              class="d-none"
                              id="Alphabetically"
                              name="Alphabetically"
                              defaultChecked={
                                pageData[0]?.sortBy == 1 ? true : false
                              }
                              value="1"
                              onChange={(e) => setSortValue(1)}
                            />
                            <label for="Alphabetically">
                              Alphabetically: A to Z
                            </label>
                          </div>
                          <div class="form-group col-12 mb-3 custom_radio">
                            <input
                              type="radio"
                              class="d-none"
                              id="Alphabetically1"
                              name="Alphabetically"
                              value="0"
                              defaultChecked={
                                pageData[0]?.sortBy == -1 ? true : false
                              }
                              onChange={(e) => setSortValue(-1)}
                            />
                            <label for="Alphabetically1">
                              Alphabetically: Z to A
                            </label>
                          </div>
                          <button className="d-none" id="reset2" type="reset">
                            reset
                          </button>
                        </form>
                      </div>
                    </div>
                    <div class="singleproduct--btns mt-4">
                      <Button
                        appearance="primary"
                        style={{
                          backgroundColor: "#3b4093",
                          padding: "10px 20px",
                        }}
                        type="reset"
                        onClick={clearFilters}>
                        Clear Filter
                      </Button>
                      <Button
                        loading={loader}
                        style={{
                          backgroundColor: "#eb3237",
                          padding: "10px 20px",
                        }}
                        appearance="primary"
                        onClick={filterProduct}>
                        Apply Filter
                      </Button>
                    </div>
                  </div>
                  <div class="col-xl-9 col-lg-8 col-md-8 pe-0 ps-xl-5 ">
                    <div class="row singleproduct_right">
                      {products?.length ? (
                        <div className="col-12 py-2 rounded Paginate ">
                          <div class="col-6 mb-2 ps-lg-3">
                            <div class="singleproducttop---left ps-lg-2">
                              Total Pages: <span>{maxPage}</span>
                            </div>
                          </div>
                          <div class="col-6 mb-2 text-end">
                            <div class="singleproduct---paginationss">
                              <a
                                onClick={() => {
                                  // window.scrollTo({ top: 0, behavior: "smooth" });
                                  activePage <= 1
                                    ? setActivePage(1)
                                    : setActivePage(activePage - 1);
                                  setData({ page: activePage });
                                }}>
                                <img
                                  src={require("../../assets/img/arrow.png")}
                                  alt=""
                                />{" "}
                                Previous
                              </a>
                              <span>{activePage}</span>
                              <a
                                onClick={() => {
                                  // window.scrollTo({ top: 0, behavior: "smooth" });
                                  activePage === maxPage
                                    ? setActivePage(maxPage)
                                    : setActivePage(activePage + 1);
                                  setData({ page: activePage });
                                }}>
                                Next{" "}
                                <img
                                  src={require("../../assets/img/arrow.png")}
                                  alt=""
                                />
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : null}

                      <div class="col-12 mt-3">
                        {products?.length ? (
                          <div class="row singleproduct---show">
                            {(products || [{}])?.map((item, index) => (
                              <div class="col-xl-3 col-lg-3 col-md-3 mb-lg-4 mb-md-4">
                                <div class="singleproduct-box">
                                  <a
                                    href="javascript:;"
                                    class="singleproduct--img">
                                    <img
                                      src={
                                        item?.products?.productImage
                                          ? item?.products?.productImage
                                          : require("../../assets/img/product.jpg")
                                      }
                                      alt="Product"
                                      onClick={() => {
                                        filtr
                                          ? setData([
                                              {
                                                category: location?.state?.name,
                                                brand: brandName,
                                                sortBy: sortValue,
                                                filtr: filtr,
                                                page: activePage,
                                              },
                                            ])
                                          : setPage(activePage);
                                        navigate(
                                          `/AllProducts/Product/:${item?.products?.slug}`,
                                          {
                                            state: {
                                              image: item?.background,
                                            },
                                          }
                                        );
                                      }}
                                    />
                                  </a>
                                  <a class="favvv---icon" href="javascript:;">
                                    {item?.products.favourite ? (
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
                                    {/* <img src="assets/images/Vector.png" alt="" /> */}
                                  </a>
                                  <span
                                    onClick={() => {
                                      setPage(activePage);
                                      navigate(
                                        `/AllProducts/Product/:${item?.products?.slug}`,
                                        {
                                          state: {
                                            image: item?.background,
                                          },
                                        }
                                      );
                                    }}>
                                    {item?.products?.unitName}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="row justify-content-center mt-5">
                            {" "}
                            <h1 className="col-auto center_art">
                              No results...
                            </h1>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </>
          <Footer />
        </>
      )}
    </div>
  );
};

export default ProductByCate;
