import Form from "../../../ui/Form";
import FormRow from "../../../ui/FormRow";
import FormElement from "../../../ui/FormElement";
import Input from "../../../ui/Input";
import { Controller, useForm } from "react-hook-form";
import {
  useAddProductCategory,
  useEditProductCategory,
  useProductCategoryName,
} from "./useProductCategory";
import Select from "../../../ui/Select";
import Switch from "../../../ui/Switch";
import ImageHover from "../../../ui/ImageHover";

const ProductCategoryForm = ({ onCloseModal, category }) => {
  let defaultValues = {
    name: category?.name || "",
    description: category?.description || "",
    parentCategory: category?.parentCategory || "",
    isFeatured: category?.isFeatured || false,
    image: category?.image || "",
  };
  const { register, handleSubmit, formState, setValue, getValues, control, watch } =
    useForm({
      defaultValues,
    });
  const uploadedImage = watch("image");
  const { errors } = formState;
  const { addProductCategory } = useAddProductCategory();
  const { editProductCategory } = useEditProductCategory();
  const { data: categories } = useProductCategoryName();

  function onSubmit(data) {
    if (!data.parentCategory) delete data.parentCategory;
    if (!data.description) delete data.description;

    const formData = new FormData();
    for (const key in data) {
      console.log(key, data[key]);
      formData.append(key, data[key]);
    }

    if (uploadedImage && uploadedImage.length > 0) {
      formData.append("categoryImage", uploadedImage[0]);
    }

    category
      ? editProductCategory({ data, id: category._id })
      : addProductCategory(formData);
    onCloseModal?.();
  }
  return (
    <Form onSubmit={handleSubmit(onSubmit)} width="500px">
      <Form.Header>
        <h1>{!category ? "Add" : "Update"} category</h1>
      </Form.Header>
      <Form.Body>
        <FormElement label="Name" id="name" error={errors?.name?.message}>
          <Input
            type="text"
            id="name"
            {...register("name", {
              required: "Category Name is required.",
            })}
          />
        </FormElement>
        <FormElement
          label="Description"
          id="description"
          error={errors?.description?.message}
        >
          <Input type="text" id="description" {...register("description", {})} />
        </FormElement>

        <FormElement
          label="Parent Category"
          id="parentCategory"
          error={errors?.parentCategory?.message}
        >
          <Controller
            name="parentCategory"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <Select {...field}>
                {categories?.data?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </Select>
            )}
          />
        </FormElement>

        <FormElement label="Featured" id="isFeatured" direction="row">
          <Controller
            name="isFeatured"
            control={control}
            render={({ field }) => (
              <Switch
                id="isFeatured"
                checked={field.value}
                onChange={(checked) => field.onChange(checked)}
              />
            )}
          />
        </FormElement>

        <FormRow columns={`${category ? "3fr 1fr" : "1fr"}`}>
          <FormElement label="Upload Image" id="image">
            <Input type="file" id="image" {...register("image")} disabled={category} />
          </FormElement>
          {category && (
            <ImageHover
              imageSrc={category.image}
              altText="Category Image"
              delay={0.2}
              scale={5}
            />
          )}
        </FormRow>

        <FormRow columns="1fr 1fr">
          <FormElement>
            <Input type="reset" value="Reset" disabled={false} />
          </FormElement>
          <FormElement>
            <Input
              type="submit"
              value={category ? "Edit" : "Create"}
              id="submit-button"
              disabled={false}
            />
          </FormElement>
        </FormRow>
      </Form.Body>
    </Form>
  );
};

export default ProductCategoryForm;
