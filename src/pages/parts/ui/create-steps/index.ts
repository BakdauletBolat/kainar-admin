import CreateForm from "./create-form.vue";
import Manufacturers from "./manufacturers.vue";
import Modifications from "./modifications.vue";
import AssignWarehouse from "./assign-warehouse.vue";
import {ref} from "vue";


const current = ref(1);
const setCurrent = (value: number) => {
    current.value = value;
}
export { CreateForm, Manufacturers, Modifications, AssignWarehouse, current, setCurrent };
