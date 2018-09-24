import * as Factory from 'factory.ts'
import * as Faker from 'faker'
import Organization, { OrganizationInterface } from '../../model/organization'

const organizationFactory = Factory.makeFactory<OrganizationInterface>({
	name: Factory.each((i) => Faker.name.firstName(4)),
})

const newOrganization = () => {
	return organizationFactory.build({})
}

const createOrganization = () => {
	return Organization.create(newOrganization()).save()
}

export { newOrganization as NewOrganization }
export { createOrganization as CreateOrganization }
