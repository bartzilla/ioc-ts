import * as sinon from 'sinon';
import {expect} from 'chai';
import {assert} from 'chai';
import {Tenant} from "../../../../src/domain/Tenant";
import {DefaultTenantServiceImpl} from "../../../../src/services/tenant/impl/DefaultTenantServiceImpl";

describe('DefaultTenantServiceUnitTest', () => {

    beforeEach(() => {
        this.newTenant = new Tenant("1","Microsoft", "cipriano.sanchez@microsoft.com", "1234", new Array());
    });

    it("it tests that tenantDao.save has been called", () => {

        let tenantDaoMock = {
            save: sinon.spy()
        };

        let callback = sinon.spy();

        let tenantService = new DefaultTenantServiceImpl(tenantDaoMock);

        tenantService.registerNewTenant(this.newTenant, callback);
        expect(tenantDaoMock.save.callCount).to.equal(1);
    });

    it("should receive the saved tenant", () => {

        let tenantDaoMock = {
            save: sinon.stub().yields(undefined, this.newTenant)
        };

        let tenantService = new DefaultTenantServiceImpl(tenantDaoMock);

        tenantService.registerNewTenant(this.newTenant, (err, tenant) => {
            expect(tenant.id).to.equal("1");
        });
    });

    it("should return an undefined tenant if tenantDao.save throws an Error", () => {

        let tenantDaoMock = {
            save: sinon.stub().yields(new Error())
        };

        let tenantService = new DefaultTenantServiceImpl(tenantDaoMock);

        tenantService.registerNewTenant(this.newTenant, (err, tenant) => {
            assert.isUndefined(tenant, 'no tenant defined');
            assert.instanceOf(err, Error, 'error should have been thrown');
        });
    });

    it("should return an error if callback is not a function", () => {

        let tenantDaoMock = {
            save: sinon.stub().yields(this.newTenant)
        };

        let consoleMock = {
            log: sinon.stub(console, 'log')
        };

        let tenantService = new DefaultTenantServiceImpl(tenantDaoMock);

        tenantService.registerNewTenant(this.newTenant, null);

        //console log logging "Callback was not provided"
        expect(consoleMock.log.callCount).to.equal(1);
    });
});
