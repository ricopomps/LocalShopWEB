import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ProductInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import { Product } from "../models/product";
import TextInputField from "./form/TextInputField";

interface AddEditProductDialogProps {
  productToEdit?: Product;
  onDismiss: () => void;
  onProductSaved: (product: Product) => void;
  storeId: string;
}

const AddEditProductDialog = ({
  productToEdit,
  onDismiss,
  onProductSaved,
  storeId,
}: AddEditProductDialogProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProductInput>({
    defaultValues: {
      name: productToEdit?.name || "",
      description: productToEdit?.description || "",
      image: productToEdit?.image || "",
    },
  });

  async function onSubmit(input: ProductInput) {
    try {
      let productResponse: Product;
      if (productToEdit) {
        productResponse = await ProductsApi.updateProduct(productToEdit._id, {
          ...input,
          storeId,
        });
      } else {
        productResponse = await ProductsApi.createProduct({
          ...input,
          storeId,
        });
      }
      onProductSaved(productResponse);
    } catch (error) {
      console.error(error);
      alert(error);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header closeButton>
        <Modal.Title>
          {productToEdit ? "Editar " : "Adicionar "}produto
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="name"
            label="Nome"
            type="text"
            placeholder="Nome do produto"
            register={register}
            registerOptions={{ required: "Campo obrigatório" }}
            error={errors.name}
          />
          <TextInputField
            name="description"
            label="Descrição"
            as="textarea"
            rows={5}
            placeholder="Descrição do produto"
            register={register}
          />
          <TextInputField
            name="image"
            label="Link da imagem"
            type="text"
            placeholder="Imagem"
            register={register}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button type="submit" form="addEditProductForm" disabled={isSubmitting}>
          Salvar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditProductDialog;
