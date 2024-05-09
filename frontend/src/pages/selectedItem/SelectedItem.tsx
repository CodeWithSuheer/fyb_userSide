import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../../features/ActionsSlice";
import { IoTrashOutline } from "react-icons/io5";
import { useAppSelector } from "../../app/hooks";
import { useDispatch } from "react-redux";
import { IoStar } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { CloudArrowUp } from "phosphor-react";
import { Button, Modal } from "keep-react";
import { FiEdit } from "react-icons/fi";
import toast from "react-hot-toast";
import {
  createreviewsAsync,
  deletereviewsAsync,
  getallreviewsAsync,
  updatereviewsAsync,
} from "../../features/reviewsSlice";

interface RouteParams {
  id: string;
}

export interface ReviewFormData {
  review: string;
  rating: number;
}

// STAR RATING
const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<FaStar key={i} className="text-[#FFC209]" />);
  }
  return <div className="flex">{stars}</div>;
};

const SelectedItem: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [reviewId, setReviewId] = useState();
  const [activeTab, setActiveTab] = useState<string>("Description");

  const allproducts = useAppSelector(
    (state) => state.products.products.products
  );
  const { id } = useParams<RouteParams>();

  // DELETE MODAL
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // UPDATE MODAL
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  const openUpdateModal = (id) => {
    setReviewId(id);
    setIsOpenUpdate(true);
  };

  const closeUpdateModal = () => {
    setIsOpenUpdate(false);

    setUpdateReviewData({
      review: "",
      rating: 0,
    });
  };

  // filter product based on id
  const selectedItem = allproducts.filter((item: any) => item.id === id);
  console.log("selectedItem", selectedItem);

  // filter review based on id
  const allreviews = useAppSelector((state) => state.reviews.allReviews);
  console.log("allreviews", allreviews);

  // selected review
  const selectedReview = allreviews.filter((item: any) => item.id === reviewId);

  const user = useAppSelector((state) => state.auth.user);
  const userID = user?.user?.id;

  // FORMDATA
  const [formData, setFormData] = useState<ReviewFormData>({
    review: "",
    rating: 0,
  });

  // UPDATE REVIEW DATA
  const [updateReviewData, setUpdateReviewData] = useState<ReviewFormData>({
    review: "",
    rating: 0,
  });

  // CALLING API TO GET ALL REVIEWS
  useEffect(() => {
    if (selectedItem) {
      dispatch(getallreviewsAsync(id));
    }
  }, [dispatch, id]);

  // HANDLE TAB CLICK
  const handleTabClick = (tabName: string) => {
    setActiveTab(tabName);
  };

  // HANDLE START CLICK
  const handleStarClick = (starValue: number) => {
    setFormData((prevData) => ({ ...prevData, rating: starValue }));
  };

  const handleUpdateStarClick = (starValue: number) => {
    setUpdateReviewData((prevData) => ({ ...prevData, rating: starValue }));
  };

  // HANDLE ADD TO CART
  const handleAddToCart = () => {
    if (selectedItem) {
      dispatch(addToCart(selectedItem));
      navigate("/products");
      toast.success("Item Added to Cart");
    }
  };

  // HANDLE SUBMIT REVIEW
  const handleSubmitReview = () => {
    const productID = id;

    if (!formData.review || formData.rating === 0) {
      alert("Please enter a review and rating.");
      return;
    }
    console.log({ productID, userID, ...formData });
    dispatch(createreviewsAsync({ productID, userID, ...formData })).then(
      () => {
        dispatch(getallreviewsAsync(id));
      }
    );
    setFormData({ review: "", rating: 0 });
  };

  // HANDLE UPDATE REVIEW
  const handleUpdateReview = () => {
    // const productID = id;

    console.log({ id, ...updateReviewData });
    dispatch(updatereviewsAsync({ id, ...updateReviewData })).then(() => {
      dispatch(getallreviewsAsync(id));
    });
    setUpdateReviewData({ review: "", rating: 0 });
  };

  // HANDLE DELETE REVIEW
  const handleDeleteReview = (id) => {
    dispatch(deletereviewsAsync(id)).then(() => {
      closeModal();
      dispatch(getallreviewsAsync(id));
    });
  };

  return (
    <>
      <div className="pt-4">
        <div className="p-6 max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
          {selectedItem.map((product, index) => (
            <div key={index}>
              <p className="mb-4">Home / Shop / {product.title}</p>
              <div
                key={index}
                className="grid items-start grid-cols-1 lg:grid-cols-2 gap-5"
              >
                <div className="w-full lg:sticky top-0 sm:flex gap-2">
                  {/* 5 IMAGES SIDEBAR */}
                  <div className="mt-1 sm:space-y-3 w-16 max-sm:flex max-sm:mb-4 max-sm:gap-4">
                    <img
                      alt="Product1"
                      className="w-full cursor-pointer"
                      src="https://readymadeui.com/images/product1.webp"
                    />
                    <img
                      alt="Product2"
                      className="w-full cursor-pointer"
                      src="https://readymadeui.com/images/product6.webp"
                    />
                    <img
                      alt="Product3"
                      className="w-full cursor-pointer"
                      src="https://readymadeui.com/images/product7.webp"
                    />
                    <img
                      alt="Product4"
                      className="w-full cursor-pointer"
                      src="https://readymadeui.com/images/product3.webp"
                    />
                  </div>

                  {/* MAIN DISPLAYER IMAGE */}
                  <img
                    alt="Product"
                    className="w-4/5 rounded object-cover"
                    src={product?.image.downloadURL}
                  />
                </div>

                {/* CONTENT SIDE */}
                <div>
                  {/* REVIEWS STARS */}
                  <div className="flex space-x-2 mb-4">
                    <IoStar size={22} className="text-[#FFC209]" />
                    <IoStar size={22} className="text-[#FFC209]" />
                    <IoStar size={22} className="text-[#FFC209]" />
                    <IoStar size={22} className="text-[#FFC209]" />
                    <IoStar size={22} className="text-[#FFC209]" />
                  </div>

                  <h2 className="text-3xl font-extrabold text-gray-800">
                    {product?.name}
                  </h2>

                  {/* ABOUT */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-gray-800">
                      (Skincare)
                    </h3>
                    <div className="space-y-3 mt-4 pl-0 text-sm text-gray-800">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Cumque, voluptas. Quidem sapiente maxime sunt
                        beatae? Asperiores illo perferendis corporis officia,
                        quam consequatur aperiam enim voluptatem cum sequi
                        doloribus numquam eum ab, tempore delectus sed.
                        Inventore asperiores sint blanditiis? Quo ipsum fugiat
                        placeat sint sit ullam illum, nostrum, unde iure, labore
                        incidunt. Ipsam perferendis, eum culpa libero quibusdam
                        illum sit aliquid.
                      </p>
                    </div>
                  </div>

                  {/* PRICE SECTION */}
                  <div className="flex flex-wrap gap-4 mt-4">
                    <p className="text-gray-800 text-2xl font-bold">
                      Rs. {product?.price}
                    </p>
                  </div>

                  {/* CART BUTTON */}
                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#EC72AF] hover:bg-[#f181b9] text-white font-bold rounded"
                    type="button"
                  >
                    Add to cart
                  </button>
                </div>
              </div>

              {/* DESCRIPTION SECTION */}
              <div className="mt-16 max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
                <ul className="flex border-b">
                  {/* Description */}
                  <li
                    className={`${
                      activeTab === "Description"
                        ? "text-gray-800 font-bold text-sm bg-gray-100"
                        : "text-gray-400 font-bold text-sm hover:bg-gray-100"
                    } py-3 px-8 border-b-2 border-gray-800 cursor-pointer transition-all`}
                    onClick={() => handleTabClick("Description")}
                  >
                    Description
                  </li>

                  {/* Reviews */}
                  <li
                    className={`${
                      activeTab === "Reviews"
                        ? "text-gray-800 font-bold text-sm bg-gray-100"
                        : "text-gray-400 font-bold text-sm hover:bg-gray-100"
                    } py-3 px-8 cursor-pointer transition-all`}
                    onClick={() => handleTabClick("Reviews")}
                  >
                    Reviews
                  </li>
                </ul>

                <div className="mt-8">
                  {/* DESCRIPTION CONTENT */}
                  {activeTab === "Description" && (
                    <>
                      <h3 className="text-lg font-bold text-gray-800">
                        Product Description
                      </h3>
                      <p className="text-sm text-gray-800 mt-4">
                        Elevate your casual style with our premium men's
                        t-shirt. Crafted for comfort and designed with a modern
                        fit, this versatile shirt is an essential addition to
                        your wardrobe. The soft and breathable fabric ensures
                        all-day comfort, making it perfect for everyday wear.
                        Its classic crew neck and short sleeves offer a timeless
                        look.
                      </p>
                      <ul className="space-y-3 list-disc mt-6 pl-4 text-sm text-gray-800">
                        <li>
                          A gray t-shirt is a wardrobe essential because it is
                          so versatile.
                        </li>
                        <li>
                          Available in a wide range of sizes, from extra small
                          to extra large, and even in tall and petite sizes.
                        </li>
                        <li>
                          This is easy to care for. They can usually be
                          machine-washed and dried on low heat.
                        </li>
                        <li>
                          You can add your own designs, paintings, or embroidery
                          to make it your own.
                        </li>
                      </ul>
                    </>
                  )}

                  {/* REVIEWS FORMS */}
                  {activeTab === "Reviews" && (
                    <div>
                      <p className="mb-1 ml-1 text-gray-700 font-medium">
                        Your Comment*
                      </p>
                      <textarea
                        id="OrderNotes"
                        className="w-full resize-y border border-gray-500 rounded-xl align-top focus:ring-0 focus:border-gray-300 sm:text-sm p-4"
                        rows={4}
                        placeholder="Write a comment..."
                        value={formData.review}
                        onChange={(e) =>
                          setFormData((prevData) => ({
                            ...prevData,
                            review: e.target.value,
                          }))
                        }
                      ></textarea>

                      {/* Star rating section */}
                      <div className="mt-4 mb-2 flex items-center justify-start gap-1">
                        <p className="mr-1 text-gray-700 font-medium text-sm">
                          Give your rating:
                        </p>
                        {[1, 2, 3, 4, 5].map((starValue) => (
                          <FaStar
                            key={starValue}
                            style={{
                              color:
                                starValue <= formData.rating
                                  ? "#FFC107"
                                  : "#D1D5DB",
                              cursor: "pointer",
                            }}
                            onClick={() => handleStarClick(starValue)}
                          />
                        ))}
                      </div>

                      <button
                        className="mt-1 text-white py-2 px-4 rounded-md bg-[#EC72AF] hover:bg-[#f181b9]"
                        onClick={handleSubmitReview}
                      >
                        Submit Review
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/*  ALL REVIEWS */}
        <div className="px-5 xl:px-0 reviews max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
          <div className="mt-10 all_reviews">
            <h2 className="text-2xl text-gray-800 font-semibold">
              ALL REVIEWS
            </h2>

            {allreviews.map((data, index) => (
              <div
                key={index}
                className="mt-3 px-6 py-4 rounded-xl border border-gray-300 bg-[#FFF3F9] all_reviews"
              >
                <div className="flex justify-between items-center gap-2">
                  <div className="left flex items-center gap-2">
                    <h2>Username</h2>{" "}
                    <p className="w-24">
                      <StarRating rating={data?.rating} />
                    </p>
                    {userID === data.userID ? (
                      <p className="text-sm">(Your Review)</p>
                    ) : null}
                  </div>
                  <div className="right">
                    <p>{new Date(data?.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="mt-2 flex justify-between items-center gap-2">
                  <p className="my-1">{data?.review}</p>

                  <div className="edit flex items-center gap-3">
                    {userID === data.userID ? (
                      <>
                        <FiEdit
                          onClick={() => openUpdateModal(data?.id)}
                          className="cursor-pointer"
                          size={20}
                        />
                        <IoTrashOutline
                          onClick={openModal}
                          className="cursor-pointer"
                          size={20}
                        />
                      </>
                    ) : null}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RELATED PRODUCT SECTION */}
      <section className="mt-10 py-14 sm:py-16 px-3 sm:px-4 xl:px-0 bg-[#FFF3F9]">
        <div className="max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
          <div className="header flex justify-between items-center flex-wrap gap-6">
            <div className="name">
              <h2 className="mb-2.5 playfair text-center text-4xl sm:text-4xl font-bold">
                Related Products
              </h2>
              <p className=" h-0.5 w-16 bg-[#EC72AF]"></p>
            </div>

            <div className="slider_button flex flex-row">
              {/* left arrow */}
              <button className="mx-1.5 inline-block rounded-full border text-[#EC72AF] hover:text-white border-[#EC72AF] hover:bg-[#EC72AF] p-2.5 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-left "
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>

              {/* right arrow */}
              <button className="mx-1.5 inline-block rounded-full border text-[#EC72AF] hover:text-white border-[#EC72AF] hover:bg-[#EC72AF] p-2.5 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevron-right "
                >
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {/* DATA */}
          <div className="data">
            <div className="mt-8 sm:mt-12 grid grid-cols-2 gap-2 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
              {/* CARD 1 */}
              <div className="group mb-3 relative group w-full pt-5 bg-white border border-gray-400 hover-border-2 hover:border-[#EC72AF] cursor-pointer">
                <img
                  className="object-cover w-full h-56 transition duration-500 group-hover:scale-105"
                  src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Rectangle_3953.png?v=1714511393"
                  alt="products "
                />

                <div className="py-5 text-center">
                  <h3 className="playfair mb-2 text-lg font-semibold text-gray-800">
                    Natural Serum
                  </h3>

                  {/* STARS */}
                  <div className="mb-2 flex items-center justify-center gap-1">
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                  </div>

                  <p className="mb-3 text-md text-gray-500">(Skincare)</p>

                  <p className="mb-3 text-xl font-semibold text-black">$100</p>

                  <button className="hidden group-hover:block absolute w-28 sm:w-40 -bottom-5 left-0 right-0 text-sm mx-auto py-3 bg-[#EC72AF] text-white font-semibold">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* CARD 2 */}
              <div className="group mb-3 relative group w-full pt-5 bg-white border border-gray-400 hover-border-2 hover:border-[#EC72AF] cursor-pointer">
                <img
                  className="object-cover w-full h-56 transition duration-500 group-hover:scale-105"
                  src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Rectangle_3953.png?v=1714511393"
                  alt="products "
                />

                <div className="py-5 text-center">
                  <h3 className="playfair mb-2 text-lg font-semibold text-gray-800">
                    Natural Serum
                  </h3>

                  {/* STARS */}
                  <div className="mb-2 flex items-center justify-center gap-1">
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                  </div>

                  <p className="mb-3 text-md text-gray-500">(Skincare)</p>

                  <p className="mb-3 text-xl font-semibold text-black">$100</p>

                  <button className="hidden group-hover:block absolute w-28 sm:w-40 -bottom-5 left-0 right-0 text-sm mx-auto py-3 bg-[#EC72AF] text-white font-semibold">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* CARD 3 */}
              <div className="group mb-3 relative group w-full pt-5 bg-white border border-gray-400 hover-border-2 hover:border-[#EC72AF] cursor-pointer">
                <img
                  className="object-cover w-full h-56 transition duration-500 group-hover:scale-105"
                  src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Rectangle_3953.png?v=1714511393"
                  alt="products "
                />

                <div className="py-5 text-center">
                  <h3 className="playfair mb-2 text-lg font-semibold text-gray-800">
                    Natural Serum
                  </h3>

                  {/* STARS */}
                  <div className="mb-2 flex items-center justify-center gap-1">
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                  </div>

                  <p className="mb-3 text-md text-gray-500">(Skincare)</p>

                  <p className="mb-3 text-xl font-semibold text-black">$100</p>

                  <button className="hidden group-hover:block absolute w-28 sm:w-40 -bottom-5 left-0 right-0 text-sm mx-auto py-3 bg-[#EC72AF] text-white font-semibold">
                    Shop Now
                  </button>
                </div>
              </div>

              {/* CARD 4 */}
              <div className="group mb-3 relative group w-full pt-5 bg-white border border-gray-400 hover-border-2 hover:border-[#EC72AF] cursor-pointer">
                <img
                  className="object-cover w-full h-56 transition duration-500 group-hover:scale-105"
                  src="https://cdn.shopify.com/s/files/1/0852/5099/8550/files/Rectangle_3953.png?v=1714511393"
                  alt="products "
                />

                <div className="py-5 text-center">
                  <h3 className="playfair mb-2 text-lg font-semibold text-gray-800">
                    Natural Serum
                  </h3>

                  {/* STARS */}
                  <div className="mb-2 flex items-center justify-center gap-1">
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                    <FaStar className="text-[#FFC107]" />
                  </div>

                  <p className="mb-3 text-md text-gray-500">(Skincare)</p>

                  <p className="mb-3 text-xl font-semibold text-black">$100</p>

                  <button className="hidden group-hover:block absolute w-28 sm:w-40 -bottom-5 left-0 right-0 text-sm mx-auto py-3 bg-[#EC72AF] text-white font-semibold">
                    Shop Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* UPDATE MODAL */}
      {selectedReview.map((data, index) => (
        <Modal key={index} isOpen={isOpenUpdate} onClose={closeUpdateModal}>
          <Modal.Body className="w-[40rem] space-y-3">
            <h2 className="py-2 text-2xl font-semibold text-gray-700">
              Update Review
            </h2>
            <Modal.Content>
              <div className="!mb-6">
                <textarea
                  id="OrderNotes"
                  className="w-full resize-y border border-gray-500 rounded-xl align-top focus:ring-0 focus:border-gray-300 sm:text-sm p-4"
                  rows={4}
                  placeholder="Write a comment..."
                  value={updateReviewData.review || data.review}
                  onChange={(e) =>
                    setUpdateReviewData({
                      ...updateReviewData,
                      review: e.target.value,
                    })
                  }
                ></textarea>

                <div className="mt-4 mb-2 flex items-center justify-start gap-1">
                  <p className="mr-1 text-gray-700 font-medium text-sm">
                    Give your rating:
                  </p>
                  {[1, 2, 3, 4, 5].map((starValue) => (
                    <FaStar
                      key={starValue}
                      style={{
                        color:
                          starValue <= (updateReviewData.rating || data.rating)
                            ? "#FFC107"
                            : "#D1D5DB",
                        cursor: "pointer",
                      }}
                      onClick={() => handleUpdateStarClick(starValue)}
                    />
                  ))}
                </div>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                onClick={closeUpdateModal}
                size="sm"
                variant="outline"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleUpdateReview(data?.id)}
                size="sm"
                className="bg-blue-600 hover:bg-blue-500"
              >
                Update Review
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      ))}

      {/* DELETE MODAL */}
      {selectedItem.map((data, index) => (
        <Modal key={index} isOpen={isOpen} onClose={closeModal}>
          <Modal.Body className="space-y-3">
            <Modal.Icon>
              <CloudArrowUp size={28} color="#D40823" />
            </Modal.Icon>
            <Modal.Content>
              <div className="!mb-6">
                <h3 className="mb-2 text-body-1 font-medium text-metal-900">
                  Delete review
                </h3>
                <p className="text-body-4 font-normal text-metal-600">
                  Are you sure? This is a permanent change.
                </p>
              </div>
            </Modal.Content>
            <Modal.Footer>
              <Button
                onClick={closeModal}
                size="sm"
                variant="outline"
                color="secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleDeleteReview(data?.id)}
                size="sm"
                className="bg-red-600 hover:bg-red-500"
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      ))}
    </>
  );
};

export default SelectedItem;
