export type Props = {
  testID?: string;
  state?: any;
  navigation?: any;
  descriptors?: any;
  type: string;
}

export type Route = {
  key: string;
  name: string;
  params?: any;
  label: string;
};
