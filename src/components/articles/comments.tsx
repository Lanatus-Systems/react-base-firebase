import { useAsync, useMultiLanguage } from "src/hooks";

import * as api from "src/api/article";
import { useContext, useEffect, useState } from "react";
import { ArticleComment } from "src/model/article";
import { AuthContext } from "src/context";
import TextComponent from "../editables/TextComponent";
import parseQuillHtml from "src/utils/quill-parser";
import { Button } from "primereact/button";
import Loading from "src/base/Loading";
import { Avatar } from "primereact/avatar";
import {
  ADMIN_DATE_TIME_FORMAT_UI,
  DATE_TIME_FORMAT_INPUT_DATE,
} from "src/constants";
import dayjs from "dayjs";

interface Iprops {
  articleId: string;
}

const Comments = ({ articleId }: Iprops) => {
  const { i18n } = useMultiLanguage();

  const { user } = useContext(AuthContext);

  const [comments, setComments] = useState<ArticleComment[]>([]);

  const [newComment, setNewComment] = useState("");

  const [getComments, loading] = useAsync(api.getComments);
  const [addComment, adding] = useAsync(api.addComment);

  useEffect(() => {
    getComments(articleId).then(setComments);
  }, [articleId, getComments]);

  console.log({ comments });

  return (
    <div>
      {loading ? (
        <Loading />
      ) : (
        <div>
          {comments.map((item, i) => {
            return (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  borderBottom: "1px dashed lightgrey",
                  padding: 5,
                }}
              >
                <div>{parseQuillHtml(item.data)}</div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "flex-start",
                    alignItems: "center",
                    marginLeft: 15,
                    background: "lightgoldenrodyellow",
                  }}
                >
                  <Avatar
                    // label={user.displayName}
                    image={item.byImg}
                    imageAlt={item.byName}
                    shape="circle"
                    // size="small"
                    style={{
                      border: "1px solid darkgrey",
                      width: "1.5rem",
                      height: "1.5rem",
                    }}
                  />
                  <div style={{ marginLeft: 5, fontSize: 12 }}>
                    <b>{item.byName}</b>
                    <span style={{ color: "grey", marginLeft: 10 }}>
                      {dayjs(item.date).format("[on] DD MMMM YYYY [at] HH:ss")}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {user && (
        <div style={{ padding: 10 }}>
          <div>
            <TextComponent rich value={newComment} onChange={setNewComment} />
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              paddingRight: 10,
              marginTop: 10,
            }}
          >
            <Button
              label="Comment"
              disabled={adding}
              onClick={() => {
                if (newComment) {
                  const newCommentObj = {
                    articleId,
                    data: newComment,
                    lang: i18n.language,
                    date: new Date(),
                    byId: user.uid,
                    byImg: user.photoURL,
                    byName: user.displayName,
                  } as ArticleComment;
                  addComment(newCommentObj).then(() => {
                    setNewComment("");
                    setComments((c) => c.concat(newCommentObj));
                  });
                }
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Comments;
