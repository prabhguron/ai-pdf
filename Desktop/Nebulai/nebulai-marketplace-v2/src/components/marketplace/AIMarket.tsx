import React, { useState } from "react";
import { FaUser, FaRobot, FaTimes } from "react-icons/fa";
import {
  FaWandMagicSparkles,
  FaCode,
  FaImage,
  FaSquareEnvelope,
} from "react-icons/fa6";
import { RiseLoader } from "react-spinners";

const aiItems = [
  {
    icon: <FaWandMagicSparkles />,
    lbl: "Text Generator",
    msg: "How likely are you to recommend our company to your friends and family?"
  },
  {
    icon: <FaCode />,
    lbl: "Code Generator",
    msg: "Can help me implement Auth System?"
  },
  {
    icon: <FaImage />,
    lbl: "Image Generator",
    msg: "Can you generate a logo related to Blockchain?"
  },
  {
    icon: <FaSquareEnvelope />,
    lbl: "Email Writer",
    msg: "Write an email to your Office boss for 2 days off"
  },
];

const AiCard = ({ icon, lbl, clickHandler }: { icon: React.ReactNode; lbl: string; clickHandler: () => void }) => {
  return (
    <div className="card h-200px cursor-pointer ai-card" onClick={clickHandler}>
      <div className="card-body d-flex flex-column justify-content-evenly text-center">
        <span className="fs-1">{icon}</span>
        <h3>{lbl}</h3>
      </div>
    </div>
  );
};

const AiChatCard = ({ title, msg, closeHandler }: { title: string; msg: string; closeHandler: () => void }) => {
  return (
    <div className="col-12 ai-chat">
      <div className="card">
        <div className="d-flex justify-content-between">
            <h3 className="mt-4 mx-4 fw-bold"> {title} </h3>
            <span className="m-4 mb-2 cursor-pointer" onClick={closeHandler}>
                <FaTimes className="fs-4 cursor-pointer float-end" />
            </span>
        </div>
        <div className="border-top mt-1 mb-4"></div>
        <div className="card-body msg_card_body pt-2">
          <div className="d-flex justify-content-start mb-2">
            <div className="img_cont_msg">
              <FaUser className="pr-4" />
              <div className="name">You</div>
            </div>
            <div className="msg_cotainer fw-bold">
              {msg}
            </div>
          </div>

          <div className="d-flex justify-content-start mb-2 mt-3">
            <div className="img_cont_msg">
              <FaRobot className="pr-4" />
              <div className="name mr-3">Neb AI</div>
            </div>
            <div className="msg_cotainer fw-bold">
              Generating answers for you...{" "}
              <RiseLoader
                className="mt-2"
                size={8}
                color={"#ab31ff"}
                loading={true}
              />
            </div>
          </div>
        </div>
        <div className="card-footer p-2">
          <div className="form-group mb-0">
            <form className="border-gradient">
              <textarea
                className="form-control type_msg"
                placeholder="Type a message..."
                required
              ></textarea>
              <button
                type="button"
                className="theme-btn btn-style-one btn-small"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

type AiItem = {
  icon: React.ReactNode;
  lbl: string;
  msg: string;
};
const AIMarket = () => {
  const [aiListing, setAiListing] = useState<AiItem[]>(aiItems);
  const [selectedChatKey, setSelectedChatKey] = useState<AiItem | null>(null);
  return (
    <div className="row gx-3 p-4">
      {aiListing.map((item, idx) => (
        <React.Fragment key={idx}>
          {!selectedChatKey && (
            <div className="col-12 col-md-3 col-lg-3 mb-2">
              <AiCard icon={item.icon} lbl={item.lbl} clickHandler={() => {
                 setSelectedChatKey(item)
              }} />
            </div>
          )}
        </React.Fragment>
      ))}
      {selectedChatKey && (
        <AiChatCard title={selectedChatKey.lbl} msg={selectedChatKey.msg} closeHandler={() => {
            setSelectedChatKey(null);
        }} />
      )}
    </div>
  );
};

export default AIMarket;
