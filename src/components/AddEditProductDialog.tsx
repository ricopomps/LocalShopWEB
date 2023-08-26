import { Button, Form, Modal } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { ProductInput } from "../network/products_api";
import * as ProductsApi from "../network/products_api";
import { Product } from "../models/product";
import TextInputField from "./form/TextInputField";
import styles from "../styles/AddEditProductDialog.module.css";
import { toast } from "react-toastify";

interface AddEditProductDialogProps {
  productToEdit?: Product;
  onDismiss: () => void;
  onProductSaved: (product: Product) => void;
  storeId: string;
  categoryList: string[];
}

const AddEditProductDialog = ({
  productToEdit,
  onDismiss,
  onProductSaved,
  storeId,
  categoryList,
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
      price: productToEdit?.price || 0,
      category: productToEdit?.category || "",
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
      toast.success("Produto editado com sucesso!");
      onProductSaved(productResponse);
    } catch (error: any) {
      toast.error(error?.response?.data?.error ?? error?.message);
    }
  }

  return (
    <Modal show onHide={onDismiss}>
      <Modal.Header className={styles.modalHeaderProduct} closeButton>
        <Modal.Title>
          {productToEdit ? "EDITAR " : "Adicionar "}PRODUTO
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className={styles.modalBodyProduct}>
        <Form id="addEditProductForm" onSubmit={handleSubmit(onSubmit)}>
          <TextInputField
            name="name"
            label="Nome:"
            type="text"
            placeholder="Nome do produto"
            register={register}
            registerOptions={{ required: "Campo obrigatório" }}
            error={errors.name}
            className={styles.inputProduct}
          />
          <TextInputField
            name="description"
            label="Descrição do produto:"
            as="textarea"
            rows={5}
            placeholder="Descrição do produto"
            register={register}
            className={styles.inputTextareaProduct}
          />
          <TextInputField
            name="image"
            label="Imagem do produto:"
            type="text"
            placeholder="Imagem"
            register={register}
            className={styles.inputProduct}
          />
          <TextInputField
            name="category"
            label="Categoria:"
            type="text"
            as="select"
            options={categoryList.map((c) => {
              return { value: c, key: c };
            })}
            hasDefaultValue={true}
            placeholder="Categoria"
            register={register}
            className={styles.selectProduct}
          />
          <TextInputField
            name="price"
            label="Preço:"
            type="text"
            placeholder="Preço"
            register={register}
            className={styles.inputProduct}
          />
        </Form>
      </Modal.Body>
      <Modal.Footer className={styles.modalFooterProduct}>
        <Button
          className={styles.bntProduct}
          type="submit"
          form="addEditProductForm"
          disabled={isSubmitting}
        >
          SALVAR
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddEditProductDialog;
