<script setup lang="ts">
import {
  useMessage,
  useDialog,
  useLoadingBar,
  useNotification,
} from "naive-ui";

if (import.meta.env.DEV) {
  window.$message = useMessage();
  window.$dialog = useDialog();
  window.$loadingBar = useLoadingBar();
  window.$notification = useNotification();
}
</script>
