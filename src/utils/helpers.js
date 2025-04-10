import _ from "lodash";
import {ref} from "vue";

const findDocByType = (c, e) => {
    const docPath = ref(_.find(c, {TYPE: e}));
    if (docPath.value) return docPath.value.PATH;
};

const formatKey = (key) => {
    return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
  }

export {findDocByType,formatKey}
