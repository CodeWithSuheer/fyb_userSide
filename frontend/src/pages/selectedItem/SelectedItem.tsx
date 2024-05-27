import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addToCart } from "../../features/ActionsSlice";
import { IoTrashOutline } from "react-icons/io5";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
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
import RelatedProducts from "./RelatedProducts";
import { getProductByIdAsync } from "../../features/productSlice";
import Loader from "react-loaders";
import "loaders.css/loaders.min.css";
import "../../Loader.scss";

export interface ReviewFormData {
  review: string;
  rating: number;
}
export interface CreateReviewPayload extends ReviewFormData {
  productID: string | undefined;
  userID: string | undefined;
}
export interface UpdateReviewPayload extends ReviewFormData {
  id: string | undefined;
}

// STAR RATING
const StarRating = ({ rating }: { rating: number }) => {
  const stars = [];
  for (let i = 0; i < rating; i++) {
    stars.push(<FaStar key={i} className="text-[#FFC209]" />);
  }
  return <div className="flex">{stars}</div>;
};

const SelectedItem: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const [reviewId, setReviewId] = useState<string>();
  const [deleteReviewId, setDeleteReviewId] = useState<string>();

  const { id } = useParams<{ id: string }>();
  const productId = id;

  useEffect(() => {
    dispatch(getProductByIdAsync(id));
  }, [id]);

  const allproducts = useAppSelector((state) => state.products.singleProduct);

  // DELETE MODAL
  const [isOpen, setIsOpen] = useState(false);

  const openModal = (id: string) => {
    setDeleteReviewId(id);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // UPDATE MODAL
  const [isOpenUpdate, setIsOpenUpdate] = useState(false);

  const openUpdateModal = (id: string) => {
    setReviewId(id);
    const review = allreviews.find((item) => item.id === id);
    if (review) {
      setUpdateReviewData({
        review: review.review,
        rating: review.rating,
      });
    }
    setIsOpenUpdate(true);
  };

  const closeUpdateModal = () => {
    setIsOpenUpdate(false);
    setUpdateReviewData({
      review: "",
      rating: 1,
    });
  };

  // filter product based on id
  const selectedItem = allproducts;

  // filter review based on id
  const allreviews = useAppSelector((state) => state.reviews.allReviews);
  const loading = useAppSelector((state) => state.reviews.loading);

  // selected review
  const selectedReview = allreviews?.filter(
    (item: any) => item.id === reviewId
  );
  const deleteReview = allreviews?.filter(
    (item: any) => item.id === deleteReviewId
  );

  const user = useAppSelector((state) => state.auth.user);
  const userID = user?.user?.id;

  // FORMDATA
  const [formData, setFormData] = useState<ReviewFormData>({
    review: "",
    rating: 1,
  });

  // UPDATE REVIEW DATA
  const [updateReviewData, setUpdateReviewData] = useState<ReviewFormData>({
    review: "",
    rating: 1,
  });

  // CALLING API TO GET ALL REVIEWS
  useEffect(() => {
    dispatch(getallreviewsAsync(id));
  }, []);

  // HANDLE START CLICK
  const handleStarClick = (starValue: number) => {
    setFormData((prevData) => ({ ...prevData, rating: starValue }));
  };

  const [selectedRating, setSelectedRating] = useState<number>();

  const handleUpdateStarClick = (starValue: number) => {
    setSelectedRating(starValue);
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
      toast.error("Please leave a review to rate the product");
      return;
    }

    dispatch(createreviewsAsync({ productID, userID, ...formData })).then(
      () => {
        dispatch(getallreviewsAsync(id));
      }
    );
    setFormData({ review: "", rating: 1 });
  };

  // HANDLE UPDATE REVIEW
  const handleUpdateReview = (
    review_Id: string | undefined,
    rating: number
  ) => {
    const id = review_Id;

    if (selectedRating !== rating) {
      const updateReviewDataOptional =
        updateReviewData as Partial<ReviewFormData>;
      delete updateReviewDataOptional.rating;

      const payload: Partial<UpdateReviewPayload> = { id, ...updateReviewData };
      payload.rating = selectedRating;

      dispatch(updatereviewsAsync(payload as UpdateReviewPayload)).then(() => {
        dispatch(getallreviewsAsync(productId));
        closeUpdateModal();
      });
    } else {
      dispatch(updatereviewsAsync({ id, ...updateReviewData })).then(() => {
        dispatch(getallreviewsAsync(productId));
        closeUpdateModal();
      });
      setUpdateReviewData({ review: "", rating: 1 });
    }
  };

  // HANDLE DELETE REVIEW
  const handleDeleteReview = (id: string) => {
    dispatch(deletereviewsAsync(id)).then(() => {
      closeModal();
      dispatch(getallreviewsAsync(productId));
    });
  };


  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUpdateReviewData({
      ...updateReviewData,
      review: e.target.value,
    });
  };

  const category = allproducts?.category;

  return (
    <>
      <div className="pt-4">
        <div className="px-4 max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
          <div>
            <p className="mt-5 mb-4">
              Home / Shop /{" "}
              <span className="text-[#EB72AF]">{selectedItem?.name}</span>
            </p>
            <div className="grid items-start grid-cols-1 lg:grid-cols-2 gap-5">
              <div className="w-full h-[23rem] lg:sticky top-0 sm:flex gap-2">
                {/* MAIN DISPLAYER IMAGE */}
                <img
                  alt="Product"
                  className="w-full h-full pr-0 lg:pr-10 object-contain rounded-lg"
                  src={selectedItem?.image?.downloadURL}
                />
              </div>

              {/* CONTENT SIDE */}
              <div className="content_side">
                <h2 className="text-3xl font-extrabold text-gray-800">
                  {selectedItem?.name}
                </h2>

                {selectedItem && (
                  <div className="flex items-center mt-4">
                    {selectedItem.averageRating === 0 ? (
                      "No Ratings"
                    ) : (
                      <StarRating rating={selectedItem.averageRating} />
                    )}
                    <span className="ml-2 text-sm text-gray-500">
                      ({selectedItem.averageRating})
                    </span>
                  </div>
                )}

                {/* ABOUT */}
                <div className="mt-4">
                  <h3 className="text-lg font-bold text-gray-800">
                    (Skincare)
                  </h3>
                  <div className="space-y-3 mt-4 pl-0 text-sm text-gray-800">
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                      Cumque, voluptas. Quidem sapiente maxime sunt beatae?
                      Asperiores illo perferendis corporis officia, quam
                      consequatur aperiam enim voluptatem cum sequi doloribus
                      numquam eum ab, tempore delectus sed. Inventore asperiores
                      sint blanditiis? Quo ipsum fugiat placeat sint sit ullam
                      illum, nostrum, unde iure, labore incidunt. Ipsam
                      perferendis, eum culpa libero quibusdam illum sit aliquid.
                    </p>
                  </div>
                </div>

                {/* PRICE SECTION */}
                <div className="flex flex-wrap items-center gap-4 mt-4">
                  {selectedItem &&
                  selectedItem.price !== selectedItem?.sale_price ? (
                    <>
                      <p
                        className={`${
                          selectedItem?.sale_price &&
                          selectedItem?.sale_price > 0
                            ? "text-gray-500 text-lg line-through"
                            : "text-gray-500 text-lg"
                        }`}
                      >
                        Rs. {selectedItem?.price}
                      </p>
                      {selectedItem?.sale_price &&
                      selectedItem?.sale_price > 0 ? (
                        <p className="text-gray-800 text-2xl font-bold">
                          Rs. {selectedItem?.sale_price}
                        </p>
                      ) : (
                        ""
                      )}
                    </>
                  ) : (
                    <p className="text-gray-800 text-2xl font-bold">
                      Rs. {selectedItem?.price}
                    </p>
                  )}
                </div>

                {/* CART BUTTON */}
                {selectedItem?.stock && selectedItem?.stock > 0 ? (
                  <button
                    onClick={handleAddToCart}
                    className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#EC72AF] hover:bg-[#f181b9] text-white font-bold rounded"
                    type="button"
                  >
                    Add to cart
                  </button>
                ) : (
                  <span className="w-full mt-4 flex items-center justify-center gap-2 px-4 py-3 bg-[#EC72AF] hover:bg-[#f181b9] text-white font-bold rounded">
                    Out Of Stock
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* DESCRIPTION & REVIEW SECTION */}
          <div className="mt-16 max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
            <div className="mt-8">
              {/* REVIEWS FORMS */}

              <>
                <div className="mb-8 reviews max-w-5xl xl:max-w-6xl xxl:max-w-7xl mx-auto">
                  <div className="mt-10 all_reviews">
                    <h2 className="text-2xl text-gray-800 font-semibold">
                      ALL REVIEWS
                    </h2>

                    {loading ? (
                      <div className="flex justify-center mt-10">
                        <Loader type="ball-beat" active={true} />
                      </div>
                    ) : (
                      <>
                        {allreviews &&
                          allreviews.map((data, index) => (
                            <div
                              key={index}
                              className="mt-3 px-6 py-4 rounded-xl border border-gray-300 bg-[#FFF3F9] all_reviews"
                            >
                              <div className="flex justify-between flex-wrap items-center gap-2">
                                <div className="left flex items-center gap-2">
                                  <h2>{data.name}</h2>{" "}
                                  <p className="w-24">
                                    <StarRating rating={data?.rating} />
                                  </p>
                                </div>
                                <div className="right">
                                  <p>
                                    {new Date(
                                      data?.createdAt
                                    ).toLocaleDateString()}
                                  </p>
                                </div>
                              </div>
                              <div className="mt-2 flex justify-between flex-wrap items-center gap-2">
                                <p className="my-1">{data?.review}</p>

                                <div className="edit flex items-center  gap-3">
                                  {userID === data.userID ? (
                                    <>
                                      <FiEdit
                                        onClick={() =>
                                          openUpdateModal(data?.id)
                                        }
                                        className="cursor-pointer"
                                        size={20}
                                      />
                                      <IoTrashOutline
                                        onClick={() => openModal(data?.id)}
                                        className="cursor-pointer"
                                        size={20}
                                      />
                                    </>
                                  ) : null}
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-1 ml-1 text-gray-700 font-medium">
                    Your Comment*
                  </p>
                  <textarea
                    id="OrderNotes"
                    className="w-full resize-y border border-gray-800 rounded-xl align-top focus:ring-0 focus:outline-none focus:border-pink-500 sm:text-sm p-4"
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
              </>
            </div>
          </div>
        </div>
      </div>

      {/* RELATED PRODUCT SECTION */}
      <RelatedProducts category={category} />

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
                  className="w-full resize-y border border-gray-800 rounded-xl align-top focus:ring-0 focus:outline-none focus:border-pink-500 sm:text-sm p-4"
                  rows={4}
                  placeholder="Write a comment..."
                  value={updateReviewData.review}
                  onChange={handleReviewChange}
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
                          starValue <= (selectedRating || data.rating)
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
                onClick={() => handleUpdateReview(data?.id, data.rating)}
                size="sm"
                className="bg-[#EC72AF] hover:bg-[#f181b9]"
              >
                Update Review
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      ))}

      {/* DELETE MODAL */}
      {deleteReview.map((data, index) => (
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
