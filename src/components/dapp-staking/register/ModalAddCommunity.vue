<template>
  <astar-default-modal
    :show="show"
    :width="544"
    :title="$t('dappStaking.modals.community.title')"
    @close="closeModal"
  >
    <div class="community-wrapper">
      <q-form ref="communityForm">
        <q-input
          v-for="(community, index) in availableCommunities"
          :key="index"
          v-model="community.handle"
          :label="community.label"
          outlined
          label-color="input-label"
          input-class="input"
          :input-style="{ fontWeight: 'bold' }"
          lazy-rules="ondemand"
          :rules="[
            (v: string) => community.validateHandle && community.validateHandle(v) || 'dd',
            (v: string) => validateAtLeastOneLink(v) || `${$t('dappStaking.modals.community.communityRequired')}`]"
          class="component"
        />

        <div class="validation-warning">
          <li>{{ $t('dappStaking.modals.community.communityRequired') }}</li>
        </div>

        <Button :width="464" :height="52" @click="handleConfirm">
          {{ $t('confirm') }}
        </Button>
      </q-form>
    </div>
  </astar-default-modal>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
import { fadeDuration, Button } from '@astar-network/astar-ui';
import { Community, CommunityDefinition } from 'src/store/dapp-staking/state';
import { wait } from 'src/hooks/helper/common';

export default defineComponent({
  components: {
    Button,
  },
  props: {
    show: {
      type: Boolean,
      required: true,
    },
    handleModalCommunity: {
      type: Function,
      required: true,
    },
    availableCommunities: {
      type: Object as PropType<CommunityDefinition[]>,
      required: true,
    },
    updateCommunities: {
      type: Function,
      required: true,
    },
  },
  setup(props) {
    const isClosingModal = ref<boolean>(false);
    const communityForm = ref();

    const closeModal = async (): Promise<void> => {
      isClosingModal.value = true;

      await wait(fadeDuration);
      props.handleModalCommunity({ isOpen: false });
      isClosingModal.value = false;
    };

    const validateAtLeastOneLink = (url: string): boolean =>
      props.availableCommunities.filter((x) => x.handle != '')?.length > 0;

    const handleConfirm = (): void => {
      communityForm?.value?.validate().then(async (success: boolean) => {
        if (success) {
          // filter communities with entered data
          const communities: Community[] = props.availableCommunities
            .filter((x) => x.handle !== '')
            .map((x) => {
              return {
                type: x.type,
                handle: x.handle,
              };
            });
          props.updateCommunities(communities);
        }
      });
    };

    return {
      isClosingModal,
      communityForm,
      closeModal,
      handleConfirm,
      validateAtLeastOneLink,
    };
  },
});
</script>

<style lang="scss" scoped>
@use 'src/components/dapp-staking/styles/register.scss';

.component {
  margin-bottom: 4px;
}

.community-wrapper {
  margin-top: 10px;
}
</style>
