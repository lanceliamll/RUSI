import PropTypes from "prop-types";
import React, { Fragment, useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { connect } from "react-redux";
import { addInquiry } from "../../actions/inquiryActions";
import {
  deleteProduct,
  editProduct,
  getProducts,
  toggleIsAvailable
} from "../../actions/productActions";
// import phPrice from "./PhPrice";

const ProductItem = ({
  editProduct,
  addInquiry,
  getProducts,
  deleteProduct,
  toggleIsAvailable,
  products,
  inquiry: { inquiry },
  auth: {
    user: { isAdmin }
  },
  errors
}) => {
  //State
  const [editData, setEditData] = useState({
    motorModel: "",
    priceFrom: "",
    priceTo: "",
    image: "",
    type: "",
    height: "",
    weight: "",
    width: "",
    length: ""
  });

  const [infoData, setInfoData] = useState({
    fullName: "",
    address: "",
    errors: {}
  });

  const [showImageModal, setShowImageModal] = useState(false);
  const [showInquireMotor, setShowInquireMotor] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCodeModal, setShowCodeModal] = useState(false);

  useEffect(() => {
    setEditData({
      motorModel: !products.motorModel ? "" : products.motorModel,
      priceFrom: !products.priceFrom ? "" : products.priceFrom,
      priceTo: !products.priceTo ? "" : products.priceTo,
      image: !products.image ? "" : products.image,
      type: !products.type ? "" : products.type,
      height: !products.height ? "" : products.height,
      weight: !products.weight ? "" : products.weight,
      width: !products.width ? "" : products.width,
      length: !products.length ? "" : products.length
    });
    if (errors) {
      setInfoData({ errors: errors });
    }
  }, [errors, products, getProducts]);

  let handleShowImageModal = () => {
    setShowImageModal(true);
  };
  let handleCloseImageModal = () => {
    setShowImageModal(false);
  };

  let handleShowInquireModal = () => {
    setShowInquireMotor(true);
  };

  let handleCloseInquireModal = () => {
    setShowInquireMotor(false);
  };

  let handleShowEditModal = () => {
    setShowEditModal(true);
  };

  let handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  let handleCloseCodeModal = () => {
    setShowCodeModal(false);
  };

  const onChange = e => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value
    });
    setInfoData({
      ...infoData,
      [e.target.name]: e.target.value
    });
  };

  const onDeleteProduct = async () => {
    const confirm = await window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (confirm) {
      await deleteProduct(products._id);
      await getProducts();
    }
  };

  const onToggleAvailable = async e => {
    e.preventDefault();
    const confirm = await window.confirm(
      "Are you sure you wanted to continue?"
    );

    if (confirm) {
      await toggleIsAvailable(products._id);
    }
    await getProducts();
  };

  const onSubmit = async e => {
    e.preventDefault();

    const {
      motorModel,
      priceFrom,
      priceTo,
      image,
      type,
      height,
      weight,
      width,
      length
    } = editData;
    const editedData = {
      motorModel,
      priceFrom,
      priceTo,
      image,
      type,
      height,
      weight,
      width,
      length
    };

    await editProduct(editedData, products._id);
    // window.location.reload();
    //Try to Refetch the products
    await getProducts();
    await handleCloseEditModal();
  };

  const onSubmitInquiry = async e => {
    e.preventDefault();
    const { motorModel } = editData;
    const { fullName, address } = infoData;

    const newInquiry = {
      fullName,
      address,
      motorModel
    };

    await addInquiry(newInquiry);
    await setInfoData({ fullName: "", address: "" });

    if (!infoData.errors) {
      await setShowInquireMotor(false);
    } else {
      await setShowInquireMotor(true);
    }

    await setShowCodeModal(true);
    await setShowInquireMotor(false);

    // setShowInquireMotor(false);
    // handleShowCodeModal();
    // setShowInquireMotor(true);
  };

  const viewRandomCode = (
    <Modal show={showCodeModal} onHide={handleCloseCodeModal} size="lg">
      <Modal.Header>
        <Modal.Title>Inquiry Code</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h5 className="text-danger">
          Please! Do not close this modal, Take note of your random generated
          code
        </h5>
        <h5 className="text-danger">
          You must present this code on RUSI Motors, This may verify your
          desired motorcycle...
        </h5>
        <h4>{inquiry !== null && inquiry.randomCode}</h4>
        <Button onClick={handleCloseCodeModal} className="btn btn-danger">
          Cancel
        </Button>
      </Modal.Body>
    </Modal>
  );

  let viewMotor = (
    <Modal show={showImageModal} onHide={handleCloseImageModal} size="lg">
      <Modal.Header>
        <Modal.Title>Product Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={products.image} className="card-img-top img-size" alt="..." />
      </Modal.Body>
    </Modal>
  );

  //INQUIRE HERE
  let inquireMotor = (
    <Modal show={showInquireMotor} onHide={handleCloseInquireModal} size="lg">
      <Modal.Header>
        <Modal.Title>{products.motorModel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Label>Full Name</Form.Label>
          <Form.Control
            type="text"
            className={errors || errors.fullName ? "is-invalid" : ""}
            placeholder="Full Name"
            name="fullName"
            value={infoData.fullName}
            onChange={e => onChange(e)}
          />
          <Form.Text className="text-danger">
            {errors && <p>{errors.fullName}</p>}
          </Form.Text>

          <Form.Label>Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Address"
            className={errors || errors.address ? "is-invalid" : ""}
            name="address"
            value={infoData.address}
            onChange={e => onChange(e)}
          />
          <Form.Text className="text-danger">
            {errors && <p>{errors.address}</p>}
          </Form.Text>

          <Form.Label>Motor Model</Form.Label>
          <Form.Control
            type="text"
            disabled
            placeholder="Motor Model"
            name="motorModel"
            value={editData.motorModel}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button
          disabled={infoData.fullName === "" || infoData.address === ""}
          onClick={onSubmitInquiry}
        >
          Inquire
        </Button>
        <Button onClick={handleCloseInquireModal} className="btn btn-primary">
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );

  const showImageModalComponent = (
    <Modal show={showImageModal} onHide={handleCloseImageModal} size="lg">
      <Modal.Header>
        <Modal.Title>Product Image</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <img src={products.image} className="card-img-top img-size" alt="..." />
      </Modal.Body>
    </Modal>
  );

  const editProductModalComponent = (
    <Modal show={showEditModal} onHide={handleCloseEditModal} size="lg">
      <Modal.Header>
        <Modal.Title>{products.motorModel}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group>
            <Form.Label>Motor Model</Form.Label>
            <Form.Control
              type="text"
              placeholder="Motor Model"
              name="motorModel"
              value={editData.motorModel}
              onChange={e => onChange(e)}
            />

            <Form.Label>Price From</Form.Label>
            <Form.Control
              type="text"
              placeholder="Price From"
              name="priceFrom"
              value={editData.priceFrom}
              onChange={e => onChange(e)}
            />

            <Form.Label>Price To</Form.Label>
            <Form.Control
              type="text"
              placeholder="Price To"
              name="priceTo"
              value={editData.priceTo}
              onChange={e => onChange(e)}
            />

            <Form.Label>Image</Form.Label>
            <Form.Control
              type="text"
              placeholder="Image"
              name="image"
              value={editData.image}
              onChange={e => onChange(e)}
            />

            <Form.Label>Type</Form.Label>
            <Form.Control
              type="text"
              placeholder="type"
              name="type"
              value={editData.type}
              onChange={e => onChange(e)}
            />

            <Form.Label>Height</Form.Label>
            <Form.Control
              type="text"
              placeholder="Height"
              name="height"
              value={editData.height}
              onChange={e => onChange(e)}
            />

            <Form.Label>Weight</Form.Label>
            <Form.Control
              type="text"
              placeholder="Weight"
              name="weight"
              value={editData.weight}
              onChange={e => onChange(e)}
            />

            <Form.Label>Width</Form.Label>
            <Form.Control
              type="text"
              placeholder="Width"
              name="width"
              value={editData.width}
              onChange={e => onChange(e)}
            />

            <Form.Label>Length</Form.Label>
            <Form.Control
              type="text"
              placeholder="Length"
              name="length"
              value={editData.length}
              onChange={e => onChange(e)}
            />
          </Form.Group>
          <Button
            type="submit"
            disabled={Number(editData.priceFrom) >= Number(editData.priceTo)}
            className="btn btn-primary"
          >
            Save Changes
          </Button>{" "}
          <Button onClick={handleCloseEditModal} className="btn btn-danger">
            Cancel
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );

  return (
    <div className="card-component">
      <div className="card">
        <img src={products.image} className="card-img-top img-size" alt="..." />
        <div className="card-body">
          <h5 className="card-title">
            {products.motorModel}{" "}
            {products.isAvailable ? (
              ""
            ) : (
              <span className="text-danger">- (Not Available) </span>
            )}
          </h5>
          <h5 className="card-title">
            ₱ {products && products !== null && products.priceFrom} -{" "}
            {products && products !== null && products.priceTo}
          </h5>
          <p className="card-text">
            <b>Type: </b>
            {products.type}
          </p>
          <p className="card-text">
            <b>Height: </b>
            {products.height}
          </p>
          <p className="card-text">
            <b>Weight: </b>
            {products.weight}
          </p>
          <p className="card-text">
            <b>Width: </b>
            {products.width}
          </p>
          <p className="card-text">
            <b>Length: </b>
            {products.length}
          </p>
          <h6>Rusi Motors Inc.</h6>
          {isAdmin ? (
            <div className="admin-buttons">
              <Button
                href="#test"
                className="btn btn-primary"
                onClick={handleShowImageModal}
              >
                View
              </Button>
              {showImageModalComponent}

              <Button className="btn btn-primary" onClick={handleShowEditModal}>
                Edit
              </Button>
              {editProductModalComponent}

              <Button
                onClick={onToggleAvailable}
                className="btn-btn-primary xs-4 md-5 lg-6"
              >
                {products.isAvailable
                  ? "Mark as Not Available"
                  : "Mark as Available"}
              </Button>

              <Button
                onClick={handleShowInquireModal}
                className="btn btn-primary"
              >
                Inquire
              </Button>

              {inquireMotor}
              {viewRandomCode}

              <Button onClick={onDeleteProduct} className="btn btn-danger">
                Delete
              </Button>
            </div>
          ) : (
            <Fragment>
              <div className="admin-buttons">
                <Button
                  onClick={handleShowImageModal}
                  className="btn btn-primary"
                >
                  View
                </Button>
                {viewMotor}

                {products.isAvailable ? (
                  <Button
                    onClick={handleShowInquireModal}
                    className="btn btn-primary"
                  >
                    Inquire
                  </Button>
                ) : (
                  <></>
                )}

                {inquireMotor}
                {viewRandomCode}
              </div>
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
};

ProductItem.propTypes = {
  product: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  addInquiry: PropTypes.func.isRequired,
  toggleIsAvailable: PropTypes.func.isRequired,
  getProducts: PropTypes.object.isRequired,
  errors: PropTypes.object.isRequired
};

const mapStateToPros = state => ({
  product: state.product,
  auth: state.auth,
  inquiry: state.inquiry,
  errors: state.errors
});

export default connect(
  mapStateToPros,
  { editProduct, deleteProduct, toggleIsAvailable, addInquiry, getProducts }
)(ProductItem);
