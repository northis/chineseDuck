<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalCenterTitle">
            <slot name="Header" />
          </h5>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body">
          <slot name="Content" />
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">No</button>
          <button type="button" class="btn btn-primary" data-dismiss="modal" @click="yesClick">Yes</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    yesClick() {
      this.$emit("confirmed", true);
    }
  },

  data() {
    return {};
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/styles/mainStyles.scss";
</style>