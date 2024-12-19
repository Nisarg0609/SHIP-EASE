import styled from "styled-components";

const StyledCategoryDetail = styled.div`
  display: flex;
  flex-direction: column;
  width: ${(props) => (props.image ? "60dvw" : "auto")};
`;
const CategoryImage = styled.div`
  flex: ${(props) => (props.image ? 5 : "auto")};
`;
const Img = styled.img`
  width: 100%;
  height: auto;
`;
const CategoryContent = styled.div`
  display: flex;
  flex-direction: row;
  gap: ${(props) => (props.image ? "6rem" : "none")};
`;
const Description = styled.div`
  margin-top: 3rem;
`;
const Text = styled.p``;
const Tree = styled.div`
  flex: ${(props) => (props.image ? 3 : "auto")};
`;
const Heading = styled.h2`
  font-size: 30px;
  font-weight: 500;
  margin-bottom: 0.5rem;
`;

import React from "react";

const CategoryDetails = ({ productCategory, children }) => {
  return (
    <StyledCategoryDetail image={productCategory?.image}>
      <CategoryContent image={productCategory?.image}>
        <CategoryImage image={productCategory?.image}>
          {productCategory.image && <Img src={productCategory.image} />}
        </CategoryImage>
        <Tree image={productCategory?.image}>
          <Heading>Category Hierarchy</Heading>
          {children}
        </Tree>
      </CategoryContent>
      {productCategory.description && (
        <Description>
          <Heading>Category Description</Heading>
          <Text>{productCategory.description && productCategory.description}</Text>
        </Description>
      )}
    </StyledCategoryDetail>
  );
};

export default CategoryDetails;
