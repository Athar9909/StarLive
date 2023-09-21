import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import AppFooter from "./appFooter";
import AppHeader from "./appHeader";

function AppCheckout() {
  const userApi = `${process.env.REACT_APP_APIENDPOINTNEW}user/getUserProfile`;
  const newOrder = `${process.env.REACT_APP_APIENDPOINTNEW}user/order/newOrder`;
  const quoteOrder = `${process.env.REACT_APP_APIENDPOINTNEW}user/quotes/quoteToOrder`;
  const [users, setUsers] = useState();
  const [comments, setComments] = useState("");
  const [delevryChoice, setDelevryChoice] = useState("In-Store Pickup");
  let location = useLocation();

  useEffect(() => {
    const getUser = async () => {
      await axios.get(userApi).then((res) => {
        console.log(res);
        setUsers(res?.data.results);
      });
    };
    getUser();
  }, []);

  const createOrder = async () => {
    if (delevryChoice == "Shipment") {
      await axios
        .post(newOrder, {
          type: "Shipment",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
        })
        .then((res) => {
          if (!res.error) {
            console.log(res?.data.message);
          }
        });
    } else if (delevryChoice == "Delivery") {
      await axios
        .post(newOrder, {
          type: "Delivery",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
        })
        .then((res) => {
          if (!res.error) {
            console.log(res?.data.message);
          }
        });
    } else if (delevryChoice == "In-Store Pickup") {
      await axios
        .post(newOrder, {
          type: "In-Store Pickup",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
        })
        .then((res) => {
          if (!res.error) {
            console.log(res?.data.message);
          }
        });
    }
  };

  const createQuoteOrder = async () => {
    if (delevryChoice == "Shipment") {
      await axios
        .post(quoteOrder, {
          type: "Shipment",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          quoteId: location?.state?.id,
        })
        .then((res) => {
          console.log(res);
        });
    } else if (delevryChoice == "Delivery") {
      await axios
        .post(quoteOrder, {
          type: "Delivery",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          quoteId: location?.state?.id,
        })
        .then((res) => {
          console.log(res);
        });
    } else if (delevryChoice == "In-Store Pickup") {
      await axios
        .post(quoteOrder, {
          type: "In-Store Pickup",
          address: users?.addressLine1 + users?.addressLine2,
          comments: comments,
          quoteId: location?.state?.id,
        })
        .then((res) => {
          console.log(res);
        });
    }
  };

  return (
    <>
      <div class="star_imp_app">
        <AppHeader />
        <div class="page-content-wrapper">
          <div class="container">
            <div class="checkout-wrapper-area py-3">
              <div class="billing-information-card mb-3">
                <div class="card billing-information-title-card ">
                  <div class="card-body">
                    <h6 class="text-center mb-0 text-white">
                      Billing Information
                    </h6>
                  </div>
                </div>
                <div class="card user-data-card">
                  <div class="card-body">
                    <div class="single-profile-data d-flex align-items-center justify-content-between">
                      <div class="title d-flex align-items-center">
                        <i class="fa-solid fa-user"></i>
                        <span>Full Name</span>
                      </div>
                      <div class="data-content">
                        {users?.firstName + " " + users?.lastName}
                      </div>
                    </div>
                    <div class="single-profile-data d-flex align-items-center justify-content-between">
                      <div class="title d-flex align-items-center">
                        <i class="fa-solid fa-envelope"></i>
                        <span>Email Address</span>
                      </div>
                      <div class="data-content">{users?.email}</div>
                    </div>
                    <div class="single-profile-data d-flex align-items-center justify-content-between">
                      <div class="title d-flex align-items-center">
                        <i class="fa-solid fa-phone"></i>
                        <span>Phone</span>
                      </div>
                      <div class="data-content">{users?.phoneNumber}</div>
                    </div>

                    {delevryChoice == "Shipment" ||
                    delevryChoice == "Delivery" ? (
                      <div class="single-profile-data d-flex align-items-center justify-content-between">
                        <div class="title d-flex align-items-center">
                          <i class="fa-solid fa-location-crosshairs"></i>

                          <span className="mt-0">Shipping Address</span>
                        </div>
                        <div class="data-content">
                          {users?.addressLine1 +
                            "," +
                            users?.state +
                            "-" +
                            users?.zipcode}
                        </div>
                      </div>
                    ) : (
                      <div class="single-profile-data d-flex align-items-center justify-content-between">
                        <div class="title  ">
                          <i class="fa-solid fa-location-crosshairs"></i>

                          <span className="mt-0">Store Address</span>
                        </div>
                        <div class="data-content">
                          <p>
                            <p className="mb-0">
                              2166 Mountain Industrial Blvd. GA, United States,
                              Georgia
                            </p>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div class="shipping-method-choose mb-3">
                <div class="card shipping-method-choose-title-card">
                  <div class="card-body">
                    <h6 class="text-center mb-0 text-white">Shipping Method</h6>
                  </div>
                </div>
                <div class="card shipping-method-choose-card">
                  <div class="card-body">
                    <div class="shipping-method-choose">
                      {users?.state == "Georgia" ? (
                        <ul class="ps-0">
                          <li>
                            <input
                              id="fastShipping"
                              type="radio"
                              name="selector"
                              onClick={() => {
                                setDelevryChoice("In-Store Pickup");
                              }}
                              defaultChecked="true"
                            />
                            <label for="fastShipping">
                              <strong>IN-STORE PICKUP</strong>
                            </label>
                            <div class="check"></div>
                          </li>

                          <li>
                            <input
                              id="normalShipping"
                              type="radio"
                              name="selector"
                              onClick={() => {
                                setDelevryChoice("Delivery");
                              }}
                            />
                            <label for="normalShipping">
                              <strong>DELIVERY-</strong>
                              {users?.cityAndState?.day?.length ? (
                                 <>
                                 (Your schedule delivery days{":"}
                                 {users?.cityAndState?.day.map((item)=>item + ",")})
                               </>
                              ) : (
                                <>
                                  (Unfortunately we dont deliver to this
                                  location please select In-store pick up or
                                  shipment.)
                                </>
                              )}
                            </label>
                            <div class="check"></div>
                          </li>
                          <li>
                            <input
                              id="courier"
                              type="radio"
                              name="selector"
                              onClick={() => {
                                setDelevryChoice("Shipment");
                              }}
                            />
                            <label for="courier">
                              <strong>SHIPMENT-</strong>
                              (Additional Shipping charges will be applied.)
                            </label>
                            <div class="check"></div>
                          </li>
                        </ul>
                      ) : (
                        <ul class="ps-0">
                          <li>
                            <input
                              id="fastShipping"
                              type="radio"
                              name="selector"
                              onClick={() => {
                                setDelevryChoice("In-Store Pickup");
                              }}
                              defaultChecked="true"
                            />
                            <label for="fastShipping">In-Store Pickup</label>
                            <div class="check"></div>
                          </li>
                          <li>
                            <input
                              id="courier"
                              type="radio"
                              name="selector"
                              onClick={() => {
                                setDelevryChoice("Shipment");
                              }}
                            />
                            <label for="courier">
                              Shipment{" "}
                              <span>
                                (Additional Shipping charges will be applied.)
                              </span>
                            </label>
                            <div class="check"></div>
                          </li>
                        </ul>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              <div class="shipping-method-choose mb-3">
                <div class="card shipping-method-choose-title-card">
                  <div class="card-body">
                    <h6 class="text-center mb-0 text-white">
                      Order Comments (optional)
                    </h6>
                  </div>
                </div>
                <div class="card">
                  <div>
                    <textarea
                      className="form-control form-control2"
                      style={{ height: "8rem" }}
                      type="text"
                      placeholder="Enter your comments...."
                      onChange={(e) => setComments(e.target.value)}
                    />
                  </div>
                </div>
              </div>
              {delevryChoice == "Delivery" ? (
                <div className="col-12 text-start">
                  {users?.cityAndState?.day?.length ? (
                    <button
                      className="comman_btn"
                      onClick={
                        location?.state?.type === "quote"
                          ? createQuoteOrder
                          : createOrder
                      }>
                      Place Order
                    </button>
                  ) : (
                    <button
                      className="comman_btn text-grey"
                      style={{
                        backgroundColor: "GrayText",
                        textDecoration: "line-through ",
                        cursor: "not-allowed",
                      }}>
                      Place Order
                    </button>
                  )}
                </div>
              ) : (
                <div className="col-12 text-start">
                  <Link
                    class="comman_btn mt-3 d-flex text-center"
                    to="/app/thankyou"
                    onClick={
                      location?.state?.type === "quote"
                        ? createQuoteOrder
                        : createOrder
                    }>
                    Place Order
                  </Link>
                </div>
              )}

              
            </div>
          </div>
        </div>
        <AppFooter />
      </div>
    </>
  );
}

export default AppCheckout;
