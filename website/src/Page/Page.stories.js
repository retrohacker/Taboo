import PageComponent from './Page'
import TabooMock from '../TabooMock.js'

export default {
  component: PageComponent,
  title: 'Page'
}

const taboo = new TabooMock()
const Template = (props) => <PageComponent {...props} />
export const Page = Template.bind({})
Page.args = {
  torrents: taboo.mockArray()
}

export const Empty = Template.bind({})
Empty.args = {
  torrents: []
}
