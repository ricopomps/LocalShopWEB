import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import TextInputField, { Option } from "../form/TextInputField";
import { useEffect, useState } from "react";
import * as ProductApi from "../../network/products_api";
import { toast } from "react-toastify";
import { CellCoordinates } from "../Grid";
import { ProductInput } from "../../network/products_api";

interface AlocateProductModalProps {
  dismissText: string;
  acceptText: string;
  dismissButtonVariant?: string;
  acceptButtonVariant?: string;
  location: CellCoordinates;
  onDismiss: () => void;
  onAccepted: () => void;
}

const AlocateProductModal = ({
  dismissText,
  acceptText,
  dismissButtonVariant,
  acceptButtonVariant,
  location,
  onDismiss,
  onAccepted,
}: AlocateProductModalProps) => {
  const [productsList, setProductsList] = useState<Option[] | undefined>(
    undefined
  );
  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<ProductInput>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await ProductApi.getProductList();
        setProductsList(
          data.map((d) => {
            return { key: d.name, value: d._id };
          })
        );
      } catch (error: any) {
        toast.error(error?.response?.data?.error ?? error?.message);
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data: ProductInput) => {
    try {
      if (!data?._id) throw Error("Produto inválido");
      data.location = location;
      await ProductApi.updateProduct(data._id, data);
      toast.success("Produto alocado com sucesso");
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  };
  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>Alocar produtos</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <TextInputField
          name="_id"
          label="Produtos"
          type="text"
          as="select"
          options={productsList}
          placeholder="Produto"
          register={register}
          registerOptions={{ required: "Campo Obrigatório" }}
        />
        <Button type="submit" disabled={isSubmitting}>
          Alocar
        </Button>
      </Form>
      <Modal.Footer>
        <Button onClick={onDismiss} variant={dismissButtonVariant}>
          {dismissText}
        </Button>
        <Button onClick={onAccepted} variant={acceptButtonVariant}>
          {acceptText}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AlocateProductModal;
