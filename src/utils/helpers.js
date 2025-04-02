import _ from "lodash";
import {ref} from "vue";

const findDocByType = (c, e) => {
    const docPath = ref(_.find(c, {TYPE: e}));
    if (docPath.value) return docPath.value.PATH;
};

export {findDocByType}
