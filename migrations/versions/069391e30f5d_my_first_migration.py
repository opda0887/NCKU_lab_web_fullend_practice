"""my_first_migration

Revision ID: 069391e30f5d
Revises: 
Create Date: 2023-04-23 14:55:29.045921

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '069391e30f5d'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
     'usertable',
     sa.Column('username', sa.String(length=255), nullable=False, primary_key=True),
     sa.Column('password', sa.String(length=255), nullable=False),
     sa.Column('birthday', sa.Date(), nullable=True),
     sa.Column('create_time', sa.DateTime(), nullable=False, server_default=sa.text('now()')),
     sa.Column('last_login', sa.DateTime(), nullable=True)
 )



def downgrade():
    op.drop_table('usertable')
