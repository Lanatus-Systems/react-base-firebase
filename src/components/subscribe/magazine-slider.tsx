import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { MultiLanguage } from "src/model/common";
import { useContext } from "react";
import { AuthContext, LayoutContext } from "src/context";
import ImagePlaceholder from "../image-placeholder";
import ImageEdit from "../editables/ImageEdit";
import { useMultiLanguage } from "src/hooks";

const sliderSettings = {
  dots: true,
  speed: 500,
  autoplay: true,
  autoplaySpeed: 3000,
  slidesToScroll: 1,
  arrows: false,
};

interface Iprops {
  slides: MultiLanguage[];
  updateSlides: (newSlides: MultiLanguage[]) => void;
}

const MagazineSlider = ({ slides, updateSlides }: Iprops) => {
  const { roles } = useContext(AuthContext);
  const { isMobile } = useContext(LayoutContext);
  const { deriveImage } = useMultiLanguage();
  return (
    <div>
      {roles.editor && (
        <button
          onClick={() => {
            updateSlides(slides.concat({}));
          }}
        >
          Add Slide
        </button>
      )}
      <Slider
        {...sliderSettings}
        slidesToShow={isMobile ? 1 : Math.min(slides.length, 4)}
      >
        {slides.map((image, index) => {
          return (
            <div key={index}>
              <div>
                <div
                  key={index}
                  style={{
                    position: "relative",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0vw 0.5vw",
                    // background: "red",
                  }}
                >
                  {image ? (
                    <img
                      src={deriveImage(image)}
                      alt="Not Available"
                      style={{
                        height: "60vh",
                        width: "100%",
                        borderRadius: "4%",
                      }}
                    />
                  ) : (
                    <ImagePlaceholder style={{ position: "absolute" }} />
                  )}

                  <ImageEdit
                    style={{
                      position: "absolute",
                      right: 10,
                      cursor: "pointer",
                    }}
                    title="Edit Story Image"
                    value={image}
                    onChange={(item) => {
                      slides[index] = item;
                      updateSlides(slides);
                    }}
                  />
                </div>
                {roles.editor && (
                  <button
                    onClick={() => {
                      window.confirm(
                        "Are you sure you want to remove slide?"
                      ) && updateSlides(slides.filter((_, i) => i !== index));
                    }}
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </Slider>
    </div>
  );
};

export default MagazineSlider;
