import reducer, { addPost, updatePost, deletePost, movePost } from "./postsSlice";

describe("postsSlice reducer", () => {
  const baseState = [
    { id: "1", title: "Existing post", content: "", date: "2026-09-10", time: "09:00", color: "#4f46e5" },
  ];

  test("addPost appends a new post with a generated id", () => {
    const next = reducer(baseState, addPost({ title: "New post", date: "2026-09-12", time: "11:00" }));
    expect(next).toHaveLength(2);
    expect(next[1].title).toBe("New post");
    expect(next[1].id).toBeDefined();
  });

  test("updatePost merges changes into the matching post", () => {
    const next = reducer(baseState, updatePost({ id: "1", changes: { title: "Renamed" } }));
    expect(next[0].title).toBe("Renamed");
    expect(next[0].date).toBe("2026-09-10"); // untouched fields remain
  });

  test("deletePost removes the post with the given id", () => {
    const next = reducer(baseState, deletePost("1"));
    expect(next).toHaveLength(0);
  });

  test("movePost reschedules a post to a new date (drag-and-drop)", () => {
    const next = reducer(baseState, movePost({ id: "1", date: "2026-09-20" }));
    expect(next[0].date).toBe("2026-09-20");
  });

  test("movePost is a no-op when the id doesn't exist", () => {
    const next = reducer(baseState, movePost({ id: "does-not-exist", date: "2026-09-20" }));
    expect(next[0].date).toBe("2026-09-10");
  });
});
