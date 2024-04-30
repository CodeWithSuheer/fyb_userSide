import Marquee from "react-fast-marquee";

const data = [
  {
    review: "We love Organic Product",
  },
  {
    review: "Organic Product",
  },
  {
    review: "We love Organic Product",
  },
  {
    review: "Organic Product",
  },
  {
    review: "We love Organic Product",
  },
  {
    review: "Organic Product",
  },
  {
    review: "We love Organic Product",
  },
  {
    review: "Organic Product",
  },
];

const FeaturesLine = () => {
  return (
    <section className="py-0 px-0 bg-[#EC72AF]">
      <Marquee direction="left" className="testimonial_marquee">
        {data.map((data, index) => (
          <div
            key={index}
            className="text-md leading-relaxed tracking-wide px-6 py-4 text-white flex items-center gap-2"
          >
            <img
              src="https://cdn.shopify.com/s/files/1/0704/6378/2946/files/Star_1.png?v=1714419321"
              alt=""
            />
            {data.review}
          </div>
        ))}
      </Marquee>
    </section>
  );
};

export default FeaturesLine;
