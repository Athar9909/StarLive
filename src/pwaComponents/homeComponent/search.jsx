import React, { useEffect, useState } from "react";
import { browserName } from "react-device-detect";
import { Link, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { searchKey } from "../../atom";
import {
  homeSearch,
  searchByBarcode,
} from "../httpServices/homeHttpService/homeHttpService";
import axios from "axios";

const Search = () => {
  const [search, setSearch] = useState("");
  const [product, setProduct] = useState([]);
  const navigate = useNavigate();
  const [text, setText] = useRecoilState(searchKey);
  const [tokenWeb, setTokenWeb] = useState(
    "6245268ah78a79a98da98da977d9d98d9898ad9d8ad"
  );
  const TempToken = `${process.env.REACT_APP_APIENDPOINTNEW}user/newAuthToken`;
  const [relateCate, setRelateCate] = useState([]);

  useEffect(() => {
    getProductList();
    setText(search);
  }, [search]);

  const getProductList = async () => {
    const { data } = await homeSearch({
      search: search?.trim(),
      limit: 8,
    });
    if (!data.error) {
      setProduct(data?.results.products);
      setRelateCate(data?.results?.subCategories);
    }
  };

  const searchProduct = async (e) => {
    e.preventDefault();
    navigate("/app/product-by-search", { state: { search: search } });
  };

  const cameraScan = async () => {
    if (window.flutter_inappwebview) {
      let Dd = await window.flutter_inappwebview.callHandler("scanBarcode");
      if (Dd?.length) {
        const { data } = await searchByBarcode({
          barcode: Dd,
        });
        if (!data.error) {
          if (data?.results?.length)
            navigate(`/app/product-detail/${data.results[0]?.slug}`, {
              state: {
                type: data?.results[0]?.type,
              },
            });
          console.log(data);
          // navigate(`/app/product-by-search/${data.results[0]._id}`)
          // window.location.reload();
        }
      }
    }
  };

  const microphoneSearch = async () => {
    setSearch("");
    if (window.flutter_inappwebview) {
      let Dd = await window.flutter_inappwebview.callHandler("micSearch");
      console.log(Dd, "hyiioioio");
      if (Dd?.length) {
        navigate("/app/product-by-search", { state: { search: Dd } });
      }
    }
  };

  const redirectToWeb = async () => {
    console.log("testing");
    try {
      await window.flutter_inappwebview.callHandler(
        "openExternalBrowser",
        `https://starimporters.com/app/redirect/constantRedirect99/${tokenWeb}`
      );

      document.getElementById("modalCloseRD").click();
    } catch (err) {
      console.log(err);
    }
  };

  const genToken = async () => {
    const token = await axios.post(TempToken);
    console.log(token.data.results.token);
    setTokenWeb(token.data.results.token);
  };

  return (
    <div>
      <div className="container mt-0">
        <div
          className={
            browserName === "WebKit" || browserName === "Chrome WebView"
              ? "search-form pt-3 "
              : "search-new pt-3 "
          }>
          <form className="" action="#" style={{ width: "100%" }}>
            <input
              className="form-control"
              type="text"
              defaultValue={search}
              placeholder={"  " + "Search in Star Importers"}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />

            <button onClick={searchProduct} className="me-5">
              <i className="fa-solid fa-magnifying-glass"></i>
            </button>
            <button type="reset" id="resetBtn" className="d-none">
              reset
            </button>
          </form>

          {browserName === "WebKit" || browserName === "Chrome WebView" ? (
            <div className="alternative-search-options">
              <Link
                className="comman_btn text-white ms-1"
                to=""
                onClick={microphoneSearch}>
                <i className="fa-solid fa-microphone"></i>
              </Link>
              <a className="comman_btn2 ms-1" onClick={() => cameraScan()}>
                <i className="fa fa-qrcode"></i>
              </a>
            </div>
          ) : (
            <div className="alternative-search-options">
              {/* <a className="comman_btn2 ms-1">
                <i className="fa fa-qrcode">
                  <input
                    className="barScanner"
                    id="p-1"
                    accept="image/jpeg,image/png,image/jfif,application/pdf,image/x-eps"
                    type="file"
                    placeholder=""
                    // onChange={(e) => onFileSelection(e.target.files, 1)}
                  />
                </i>
              </a> */}
            </div>
          )}
        </div>
      </div>
      {browserName === "WebKit" || browserName === "Chrome WebView" ? (
        <div>
          {search?.length || relateCate?.length >= 1 ? (
            <div className="top-products-area py-1">
              <div className="container">
                <div className="section-heading d-flex align-items-center justify-content-between dir-rtl mb-1">
                  <p className="mt-0 mb-4">Showing results for "{search}"</p>
                  {search === "Tobacco" ||
                  search === "Tobacco " ||
                  search === "tobacco" ||
                  search === "tobaco " ||
                  search === "Tobacc " ||
                  search === "tobac " ||
                  search === "tobacco " ||
                  search === "tob" ||
                  search === "toba" ||
                  search === "tobac" ||
                  search === "tobacc" ||
                  search === "smoke" ||
                  search === "cigars" ||
                  search === "Cigerettes" ||
                  search === "vapes" ? (
                    <div className="text-center">
                      <img src={require("../../assets/img/noitem.png")}></img>
                      <a
                        data-bs-toggle="modal"
                        className="fw-bold mx-2"
                        data-bs-target="#staticBackdrop"
                        onClick={genToken}>
                        Click Here
                      </a>
                      to buy this product from our website.{" "}
                    </div>
                  ) : null}
                </div>
                {relateCate?.length >= 1 ? (
                  <>
                    Related Sub-Categories
                    <div className=" mb-2">
                      {relateCate
                        ?.filter(
                          (itm, idx) =>
                            itm.categoryName != "639a042ff2f72167b43774de" &&
                            itm.categoryName != "639a7617f2f72167b4377754" &&
                            itm.isTobacco != true
                        )
                        .map((itm, ind) => (
                          <span
                            className=" text-primary  fw-bold"
                            style={{
                              fontSize: "12px",
                            }}
                            onClick={() => {
                              navigate(
                                `/app/product-subCategory/${itm?.subCategoryName}`,
                                {}
                              );
                            }}>
                            {itm?.subCategoryName && itm?.subCategoryName} ,
                          </span>
                        ))}
                    </div>
                  </>
                ) : (
                  ""
                )}
                {product?.length ? (
                  <div className="row g-2 ">
                    {(product || [])
                      ?.filter(
                        (itm, idx) =>
                          itm.category != "639a042ff2f72167b43774de" &&
                          idx < 15 &&
                          itm.category != "639a7617f2f72167b4377754" &&
                          itm.isTobaccoProduct != true
                      )
                      .map((item, index) => {
                        return (
                          <div className="col-6 col-md-4" key={index}>
                            <div className="card product-card">
                              <div className="card-body">
                                <Link
                                  className="product-thumbnail d-block"
                                  to={`/app/product-detail/${item.slug}`}
                                  state={{ type: item?.type }}>
                                  <img
                                    className="mb-2"
                                    src={
                                      // item?.type.flavourImage
                                      //   ? item?.type.flavourImage
                                      //   :

                                      item?.productImage ||
                                      require("../../assets/img/product.jpg")
                                    }
                                    alt=""
                                  />
                                </Link>

                                <Link
                                  className="product-title"
                                  to={`/app/product-detail/${item.slug}`}
                                  state={{ type: item?.type }}>
                                  {/* {item.unitName + "-" + item?.type.flavour} */}
                                  {item?.unitName}
                                </Link>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div>
                    <img
                      className="no-data"
                      src={require("../../assets/img/no-data.gif")}
                    />
                    <h1 className="text-center"> No Product Results</h1>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      ) : (
        <div>
          {search?.length || relateCate?.length >= 1 ? (
            <div className="top-products-area py-1">
              <div className="container">
                {relateCate?.length >= 1 ? (
                  <>
                    Related Sub-Categories
                    <div className=" mb-2">
                      {relateCate?.map((itm, ind) => (
                        <span
                          className=" text-primary  fw-bold"
                          style={{
                            fontSize: "12px",
                          }}
                          onClick={() => {
                            navigate(
                              `/app/product-subCategory/${itm?.subCategoryName}`,
                              {}
                            );
                          }}>
                          {itm?.subCategoryName && itm?.subCategoryName} ,
                        </span>
                      ))}
                    </div>
                  </>
                ) : (
                  ""
                )}
                {product?.length ? (
                  <div className="row g-2 ">
                    {(product || [])?.map((item, index) => {
                      return (
                        <div className="col-6 col-md-4" key={index}>
                          <div className="card product-card">
                            <div className="card-body">
                              <Link
                                className="product-thumbnail d-block"
                                to={`/app/product-detail/${item.slug}`}
                                state={{ type: item?.type }}>
                                <img
                                  className="mb-2"
                                  src={
                                    // item?.type.flavourImage
                                    //   ? item?.type.flavourImage
                                    //   :
                                    item?.productImage ||
                                    require("../../assets/img/product.jpg")
                                  }
                                  alt=""
                                />
                              </Link>

                              <Link
                                className="product-title"
                                to={`/app/product-detail/${item?.slug}`}
                                state={{ type: item?.type }}>
                                {/* {item.unitName + "-" + item?.type.flavour} */}
                                {item?.unitName}
                              </Link>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div>
                    <img
                      className="no-data"
                      src={require("../../assets/img/no-data.gif")}
                    />
                    <h1 className="text-center"> No Products Results</h1>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}
      <div
        class="modal fade"
        id="staticBackdrop"
        data-bs-backdrop="static"
        data-bs-keyboard="false"
        tabindex="-1"
        aria-labelledby="staticBackdropLabel"
        aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="staticBackdropLabel">
                Please Confirm !
              </h5>
              <button
                type="button"
                class="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                id="modalCloseRD"></button>
            </div>
            <div class="modal-body">Open website in External Browser.</div>
            <div class="modal-footer">
              <button
                type="button"
                class="btn btn-secondary"
                data-bs-dismiss="modal"
                id="modalCLose">
                Close
              </button>
              <Link
                // to={}
                onClick={() => {
                  redirectToWeb();
                  // document.getElementById("modalClose").click();
                }}
                class="btn btn-primary">
                Confirm
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
