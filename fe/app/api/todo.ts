import { get, post, delele } from "./base";

const TodoApi = {
    getAll: function() {
        return get("/todo/");
    },
    addItem: function(taskName: string) {
        return post("/todo/add/", {taskName: taskName});
    },
    removeItem: function(id: string) {
        return delele(`/todo/delete/${id}/`);
    },
    checkItem: function(id: string) {
        return post(`/todo/${id}/`);
    },
}

export default TodoApi;