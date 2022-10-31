import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Image from "next/image";
import ReactPlayer from "react-player";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1000,
  height: 600,
  bgcolor: "black",
  border: "0px solid #000",
  boxShadow: 24,
  p: 0,
  borderRadius: "30px",
};

export default function BasicModal({ name, src, profile, video }) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <div
        className=" custom-pulse relative h-14 w-14 md:h-20 md:w-20 lg:h-56 lg:w-32 cursor-pointer overflow-x p-3 transition-duration-200 transform ease-in hover:scale-105 "
        onClick={handleOpen}
      >
        <Image
          className="absolute opacity-0 lg:opacity-100 rounded-full z-50 top-10 border-4 border-indigo-600 "
          src={profile}
          width={60}
          height={60}
          layout="fixed"
          objectFit="cover"
        ></Image>
        <Image
          className="object-cover rounded-full lg:rounded-3xl brightness-90"
          src={src}
          layout="fill"
        ></Image>
        <p className="text-white absolute bottom-3.5 font-semibold text-xs md:text-lg">
          {name}
        </p>
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography> */}
          <div className="w-full flex justify-center align-center rounded-2xl overflow-hidden">
            <ReactPlayer
              width="1000px"
              height="600px"
              url={video}
              controls={true}
            />
          </div>
        </Box>
      </Modal>
    </div>
  );
}
