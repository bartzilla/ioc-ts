import * as sinon from 'sinon';
import {expect} from 'chai';
import {Tenant} from "../../../../src/domain/Tenant";
import {DefaultTenantServiceImpl} from "../../../../src/services/tenant/impl/DefaultTenantServiceImpl";

describe('DefaultTenantServiceUnitTest', () => {

    beforeEach(() => {

    });

    it('should be able to init app', () =>  {

        let tenantDaoMock = {
            save: sinon.spy()
        };
        let tenantService = new DefaultTenantServiceImpl(tenantDaoMock);

        let newTenant = new Tenant("1","Microsoft", "cipriano.sanchez@microsoft.com", "1234", new Array());
        tenantService.registerNewTenant(newTenant);

        expect(tenantDaoMock.save.callCount).to.equal(1);
    });
});
