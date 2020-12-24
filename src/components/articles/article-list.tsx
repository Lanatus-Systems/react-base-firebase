import { FunctionComponent } from "react";
import { useParams } from "react-router-dom";

interface Iprops {
  category: string;
}
const ArticleList: FunctionComponent<Iprops> = (props: Iprops) => {
  const { category } = useParams<Iprops>();
  return (
    <div>
      <div>{category}</div>
      <div>Articles</div>
    </div>
  );
};

export default ArticleList;
