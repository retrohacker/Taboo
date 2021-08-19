import LoadingComponent from './Loading'

export default {
  component: LoadingComponent,
  title: 'Loading'
}

const Template = (props) => <LoadingComponent {...props} />
export const Loading = Template.bind({})
