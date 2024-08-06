"use client"
import { Gallery, Item } from "react-photoswipe-gallery";
import "photoswipe/dist/photoswipe.css";
import Image from "next/image";

const CertificatesShowCase = ({ certificateImages}: {certificateImages: (string | File)[]}) => {
  if (!certificateImages.length) return;

  return (
    <>
      <Gallery>
        {certificateImages.map((img: any, idx) => (
          <div className="col-lg-3 col-md-3 col-sm-6" key={idx}>
            <figure className="image" role="button">
              <Item original={img} thumbnail={img} width={450} height={300}>
                {({ ref, open }:{ref: any, open: any}) => (
                  <div className="lightbox-image" ref={ref} onClick={open}>
                    <Image src={img} alt="resource" width={450} height={300} loading="lazy" />{" "}
                    <span className="icon flaticon-plus"></span>
                  </div>
                )}
              </Item>
            </figure>
          </div>
        ))}
      </Gallery>
    </>
  );
};

export default CertificatesShowCase;
