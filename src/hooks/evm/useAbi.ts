import { ref } from 'vue';
import { useStore } from 'src/store';
import { u8aToString } from '@polkadot/util';

export interface FileState {
  data: Uint8Array;
  name: string;
  size: number;
}

export default function useAbi() {
  const abi = ref(null);
  const isAbiError = ref(false);
  const errorText = ref('');

  const store = useStore();

  const onChangeAbi = ({ data }: FileState): void => {
    const json = u8aToString(data);

    try {
      const newAbi = JSON.parse(json);
      abi.value = newAbi;

      isAbiError.value = false;

      // source?.codeHash &&
      //   store.dispatch('contracts/saveCode', {
      //     api: api?.value,
      //     _codeHash: source?.codeHash,
      //     partial: { abi: json },
      //   });
    } catch (error: any) {
      console.error(error);

      isAbiError.value = true;
      errorText.value = error;
    }
  };

  const onRemoveAbi = (): void => {
    isAbiError.value = false;

    // source?.codeHash &&
    //   store.dispatch('contracts/saveCode', {
    //     api: api?.value,
    //     _codeHash: source?.codeHash,
    //     partial: { abi: null },
    //   });
  };


  return {
    errorText,
    isAbiError,
    onChangeAbi,
    onRemoveAbi,
  }
}