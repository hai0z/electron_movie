import { Link } from "react-router-dom";

const Error = () => {
  return (
    <section className="h-screen flex justify-center items-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primarys">
            404
          </h1>
          <p className="mb-4 text-3xl tracking-tight font-bold  md:text-4xl">
            Có lỗi xảy ra
          </p>
          <p className="mb-4 text-lg font-light ">
            Vui lòng quay lại trang chủ
          </p>
          <Link
            to="/"
            className="inline-flex bg-primarys focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center  my-4 text-primary-content"
          >
            Quay lại trang chủ
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Error;
