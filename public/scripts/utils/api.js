var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const apiUrl = "http://localhost:8000/api/v1";
const apiCall = (endpoint, pageSize = 7, category, sort) => __awaiter(void 0, void 0, void 0, function* () {
    const sortBy = (sort === null || sort === void 0 ? void 0 : sort.sortBy) ? sort.sortBy : null;
    const asc = (sort === null || sort === void 0 ? void 0 : sort.asc) ? sort.asc : true;
    let query = "";
    if (category) {
        query += `genre=${category}&`;
    }
    if (sortBy) {
        query += `sort_by=${asc ? "-" : ""}${sortBy}&`;
    }
    try {
        const response = yield fetch(`${apiUrl}/${endpoint}?${query}page_size=${pageSize}`);
        const { results } = yield response.json();
        return results;
    }
    catch (error) { }
});
export { apiCall };
