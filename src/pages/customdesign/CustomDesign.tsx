import CustomizeLayout from "../../Layouts/CustomizeLayout";

function CustomDesign() {
  return (
    <CustomizeLayout>
      <iframe
        // src="http://localhost:8080/template1.html"
        src="https://tours.mywpsite.org/"
        // src="http://localhost:8080/demo.html"
        title="website"
        id="myIframe"
        className={`h-full w-full transition-fade shadow-lg rounded-lg `}
      />
    </CustomizeLayout>
  );
}

export default CustomDesign;
