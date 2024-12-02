"""empty message

Revision ID: 9bb16141e6cb
Revises: 4ae085cc16bb
Create Date: 2023-12-26 23:56:35.539969

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = '9bb16141e6cb'
down_revision = '4ae085cc16bb'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_settings')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('user_settings',
    sa.Column('id', sa.INTEGER(), autoincrement=True, nullable=False),
    sa.Column('user_id', sa.INTEGER(), autoincrement=False, nullable=False),
    sa.Column('model_name', postgresql.ENUM('GPT_3_5_TURBO', 'GPT_3_5_TURBO_16K', 'GPT_4', name='assistantmodel'), server_default=sa.text("'GPT_3_5_TURBO'::assistantmodel"), autoincrement=False, nullable=False),
    sa.Column('color_scheme', postgresql.ENUM('LIGHT', 'DARK', 'SYSTEM', name='colorscheme'), server_default=sa.text("'SYSTEM'::colorscheme"), autoincrement=False, nullable=False),
    sa.Column('show_assistant_messages', sa.BOOLEAN(), server_default=sa.text('false'), autoincrement=False, nullable=False),
    sa.Column('css_framework', postgresql.ENUM('BOOTSTRAP', 'DAISYUI', name='cssframework'), server_default=sa.text("'BOOTSTRAP'::cssframework"), autoincrement=False, nullable=False),
    sa.ForeignKeyConstraint(['user_id'], ['user.id'], name='user_settings_user_id_fkey'),
    sa.PrimaryKeyConstraint('id', name='user_settings_pkey'),
    sa.UniqueConstraint('user_id', name='user_settings_user_id_key')
    )
    # ### end Alembic commands ###
