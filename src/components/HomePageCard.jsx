function HomePageCard({ title, img, link }) {
  return (
    <div className="h-[420px] bg-white z-30 m-3 cursor-pointer">
      <div className="text-lg xl:text-xl font-semibold ml-4 mt-4">{title}</div>
      <div className="h-[300px] m-4">
          <img className="h-[100%] w-[100%] object-cover" src={img} alt="home card" />
      </div>
      <div className="text-blue-400 pl-4">
          {link}
       
      </div>
    </div>
  );
}

export default HomePageCard;
