import { GoHorizontalRule } from "react-icons/go";

const CategoryTree = ({ category }) => {
  return (
    <div
      style={{ marginLeft: "20px", borderLeft: "1px solid #ccc", paddingLeft: "10px" }}
    >
      <div
        style={{
          fontWeight: "bold",
          marginBottom: "5px",
        }}
      >
        <GoHorizontalRule /> <span>{category.name}</span>
      </div>

      {category.subCategories && category.subCategories.length > 0 && (
        <div>
          {category.subCategories.map((subCategory) => (
            <CategoryTree key={subCategory._id} category={subCategory} />
          ))}
        </div>
      )}
    </div>
  );
};
export default CategoryTree;
