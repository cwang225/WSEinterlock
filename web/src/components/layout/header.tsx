/*
Header comoponent of the application
*/
const Header = () => {
  return (
    <div className="header ">
      <div>
        <img
          src="/assets/JHU.logo_horizontal.white.svg"
          className="h-[100px]"
        />
      </div>

      <div className="freight-text-medium text-5xl self-center right-[calc(50vw-399px/2)] text-white">
        WSE Manufacturing
      </div>
    </div>
  );
};

export default Header;
